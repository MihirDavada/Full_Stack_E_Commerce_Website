# Generated by Django 4.0.4 on 2022-05-19 13:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('firstApp', '0002_product_product_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(blank=True, default='/media/placeholder.png', null=True, upload_to=''),
        ),
    ]