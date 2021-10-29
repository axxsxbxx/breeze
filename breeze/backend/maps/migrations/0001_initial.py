# Generated by Django 3.2.8 on 2021-10-27 10:58

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Place',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('category', models.IntegerField()),
                ('name', models.CharField(max_length=20)),
                ('address', models.TextField()),
                ('phone', models.CharField(max_length=20)),
                ('kakao_url', models.TextField()),
                ('review', models.IntegerField()),
                ('score', models.IntegerField()),
                ('tag', models.IntegerField()),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
            ],
        ),
    ]
