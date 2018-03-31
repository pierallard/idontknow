from PIL import Image
import sys

asset = 'human'
if len(sys.argv) > 1:
    asset = sys.argv[1]

imageSource = Image.open("../assets/{asset}.png".format(asset=asset))
imageResult = Image.new(imageSource.mode, imageSource.size, (0, 0, 0, 0))
pixels = imageSource.load()
pixelsResult = imageResult.load()

width, height = imageSource.size

def _is_green_clair(color):
    return color[0] == 0 and color[1] == 222 and color[2] == 45


def _is_green_fonce(color):
    return color[0] == 13 and color[1] == 129 and color[2] == 46


for x in range(width):
    for y in range(height):
        if _is_green_clair(pixels[x, y]):
            pixelsResult[x, y] = (251, 0, 76, 255)
        elif _is_green_fonce(pixels[x, y]):
            pixelsResult[x, y] = (122, 37, 78, 255)
        else:
            pixelsResult[x, y] = pixels[x, y]


generated_file = "../assets/{asset}_red.png".format(asset=asset)
print('Generated file: "{generated_file}"'.format(generated_file=generated_file))
imageResult.save(generated_file)
