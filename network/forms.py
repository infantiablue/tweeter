from django.forms import ModelForm
from django import forms
from django.forms import ValidationError
from .models import User, Post
from PIL import Image


class CustomFileInput(forms.ClearableFileInput):
    template_name = 'network/widgets/forms/avatar.html'


class UserForm(ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'avatar']

    first_name = forms.CharField(widget=forms.TextInput(
        attrs={'class': 'form-control mb-2'}))
    last_name = forms.CharField(widget=forms.TextInput(
        attrs={'class': 'form-control mb-2'}))
    email = forms.EmailField(widget=forms.EmailInput(
        attrs={'class': 'form-control mb-2'}), disabled=True)
    avatar = forms.ImageField(widget=CustomFileInput())

    def clean_avatar(self):
        data = self.cleaned_data['avatar']
        img = Image.open(data)
        width, height = img.size

        print(width)
        # Always return a value to use as the new cleaned data, even if
        # this method didn't change it.
        return data


class PostForm(ModelForm):
    class Meta:
        model = Post
        fields = ['text']

    text = forms.CharField(
        label=False, widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 3}), required=True, max_length=300)
