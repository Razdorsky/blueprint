// Mattes for the Blueprint stage: separates the subject of a photograph or a video frame from
// what is behind it, with macOS Vision, so a word can stand between them.
//   swift matte.swift subject <in> <out.png> [instance,...]   salient subjects (the Dome, a table, people)
//   swift matte.swift person  <in> <out.png>                  people only, with fine hair
//   swift matte.swift frames  <dir-in> <dir-out> person|subject   every PNG in a folder (video frames)
// The matte is written as an 8-bit grey PNG at the input's full size: white is the subject.
import Foundation
import Vision
import CoreImage
import ImageIO
import UniformTypeIdentifiers

let context = CIContext(options: [.useSoftwareRenderer: false])

func load(_ path: String) -> CGImage {
  guard let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: path) as CFURL, nil),
        let image = CGImageSourceCreateImageAtIndex(src, 0, nil) else { fatalError("cannot read \(path)") }
  return image
}

func write(_ image: CIImage, size: CGSize, to path: String) {
  let scaled = image.transformed(by: CGAffineTransform(scaleX: size.width / image.extent.width, y: size.height / image.extent.height))
  guard let cg = context.createCGImage(scaled, from: CGRect(origin: .zero, size: size), format: .L8, colorSpace: CGColorSpace(name: CGColorSpace.linearGray)) else { fatalError("render failed") }
  guard let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: path) as CFURL, UTType.png.identifier as CFString, 1, nil) else { fatalError("cannot write \(path)") }
  CGImageDestinationAddImage(dest, cg, nil)
  CGImageDestinationFinalize(dest)
}

func subject(_ image: CGImage, instances wanted: [Int]?) -> CIImage {
  let handler = VNImageRequestHandler(cgImage: image)
  let request = VNGenerateForegroundInstanceMaskRequest()
  try! handler.perform([request])
  guard let result = request.results?.first else { return CIImage(color: .black).cropped(to: CGRect(x: 0, y: 0, width: image.width, height: image.height)) }
  let all = result.allInstances
  let chosen = wanted.map { IndexSet($0) } ?? all
  FileHandle.standardError.write("instances: \(all.map { $0 }) using \(chosen.map { $0 })\n".data(using: .utf8)!)
  let buffer = try! result.generateScaledMaskForImage(forInstances: chosen, from: handler)
  return CIImage(cvPixelBuffer: buffer)
}

func person(_ image: CGImage) -> CIImage {
  let handler = VNImageRequestHandler(cgImage: image)
  let request = VNGeneratePersonSegmentationRequest()
  request.qualityLevel = .accurate
  request.outputPixelFormat = kCVPixelFormatType_OneComponent8
  try! handler.perform([request])
  guard let result = request.results?.first else { fatalError("no person found") }
  return CIImage(cvPixelBuffer: result.pixelBuffer)
}

let args = CommandLine.arguments
guard args.count >= 4 else { print("usage: matte.swift subject|person|frames ..."); exit(1) }
switch args[1] {
case "subject":
  let image = load(args[2])
  let wanted = args.count > 4 ? args[4].split(separator: ",").compactMap { Int($0) } : nil
  write(subject(image, instances: wanted), size: CGSize(width: image.width, height: image.height), to: args[3])
case "person":
  let image = load(args[2])
  write(person(image), size: CGSize(width: image.width, height: image.height), to: args[3])
case "frames":
  let mode = args.count > 4 ? args[4] : "person"
  let files = try! FileManager.default.contentsOfDirectory(atPath: args[2]).filter { $0.hasSuffix(".png") }.sorted()
  try? FileManager.default.createDirectory(atPath: args[3], withIntermediateDirectories: true)
  for name in files {
    let image = load("\(args[2])/\(name)")
    let matte = mode == "person" ? person(image) : subject(image, instances: nil)
    write(matte, size: CGSize(width: image.width, height: image.height), to: "\(args[3])/\(name)")
  }
  print("\(files.count) frames")
default:
  print("unknown mode \(args[1])"); exit(1)
}
