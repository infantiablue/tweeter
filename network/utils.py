from PIL import Image
import sys
from django.http import JsonResponse
from smartcrop import SmartCrop
from django.core.files.uploadhandler import FileUploadHandler
from django.core.files.uploadedfile import TemporaryUploadedFile
# from django.conf import settings


# class RezieUploadHandler(FileUploadHandler):
#     """
#     Upload handler that streams data into a temporary file.
#     """

#     def new_file(self, *args, **kwargs):
#         """
#         Create the file object to append to as data is coming in.
#         """
#         super().new_file(*args, **kwargs)
#         self.file = TemporaryUploadedFile(
#             self.file_name, self.content_type, 0, self.charset, self.content_type_extra)
#         _, ext = os.path.splitext(self.file.temporary_file_path())

#         os.remove(
#             f'{settings.MEDIA_ROOT}/user_{self.request.user.id}/avatar{ext}')
#         os.remove(
#             f'{settings.MEDIA_ROOT}/user_{self.request.user.id}/avatar_128{ext}')

#     def receive_data_chunk(self, raw_data, start):
#         self.file.write(raw_data)

#     def file_complete(self, file_size):
#         self.file.seek(0)
#         self.file.size = file_size
#         return self.file

#     def upload_complete(self):
#         pass

def login_required_ajax(view_func, *args, **kwargs):
    from functools import wraps

    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'You need to log in to process'})
        return view_func(request, *args, **kwargs)
    return _wrapped_view


def crop_smart(inputfile, outputfile, img_height, img_width):

    image = Image.open(inputfile)
    if image.mode != 'RGB' and image.mode != 'RGBA':
        sys.stderr.write("{1} convert from mode='{0}' to mode='RGB'\n".format(
            image.mode, inputfile))
        new_image = Image.new('RGB', image.size)
        new_image.paste(image)
        image = new_image

    cropper = SmartCrop()
    result = cropper.crop(image, width=100, height=int(
        img_height / img_width * 100))

    box = (
        result['top_crop']['x'],
        result['top_crop']['y'],
        result['top_crop']['width'] + result['top_crop']['x'],
        result['top_crop']['height'] + result['top_crop']['y']
    )
    # it should be an option to convert image to greyscale
    cropped_image = image.crop(box)
    cropped_image.thumbnail((img_width, img_height), Image.ANTIALIAS)
    cropped_image.save(outputfile, quality=100)
