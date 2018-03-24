from PIL import Image

imageSource = Image.open("../assets/human.png")
imageResult = Image.new(imageSource.mode, imageSource.size, (0, 0, 0, 0))
pixels = imageSource.load()
pixelsResult = imageResult.load()

width, height = imageSource.size


def _is_colored(color):
    return color[3] != 0


def _has_top_neighbor(image_pixels, pixel_x, pixel_y):
    if pixel_y == 0:
        return False
    return _is_colored(image_pixels[pixel_x, pixel_y - 1])


def _has_bottom_neighbor(image_pixels, pixel_x, pixel_y, image_height):
    if pixel_y == (image_height - 1):
        return False
    return _is_colored(image_pixels[pixel_x, pixel_y + 1])


def _has_left_neighbor(image_pixels, pixel_x, pixel_y):
    if pixel_x == 0:
        return False
    return _is_colored(image_pixels[pixel_x - 1, pixel_y])


def _has_right_neighbor(image_pixels, pixel_x, pixel_y, image_width):
    if pixel_x == (image_width - 1):
        return False
    return _is_colored(image_pixels[pixel_x + 1, pixel_y])


def _has_colored_neighbor(image_pixels, pixel_x, pixel_y, image_width, image_height):
    return _has_top_neighbor(image_pixels, pixel_x, pixel_y) or \
           _has_bottom_neighbor(image_pixels, pixel_x, pixel_y, image_height) or \
           _has_left_neighbor(image_pixels, pixel_x, pixel_y) or \
           _has_right_neighbor(image_pixels, pixel_x, pixel_y, image_width)


for x in range(width):
    for y in range(height):
        if _is_colored(pixels[x, y]):
            pixelsResult[x, y] = pixels[x, y]
        elif _has_colored_neighbor(pixels, x, y, width, height):
            pixelsResult[x, y] = (0, 0, 0, 255)

imageResult.save("../assets/human_selected2.png")
