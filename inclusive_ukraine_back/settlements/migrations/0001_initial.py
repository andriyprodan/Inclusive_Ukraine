# Generated by Django 5.1.4 on 2024-12-25 09:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Region',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True, verbose_name='Назва')),
            ],
            options={
                'verbose_name': 'Область',
                'verbose_name_plural': 'Області',
            },
        ),
        migrations.CreateModel(
            name='District',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Назва')),
                ('region', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='districts', to='settlements.region', verbose_name='Область')),
            ],
            options={
                'verbose_name': 'Район',
                'verbose_name_plural': 'Райони',
                'unique_together': {('name', 'region')},
            },
        ),
        migrations.CreateModel(
            name='Settlement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Назва')),
                ('district', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='settlements', to='settlements.district', verbose_name='Район')),
            ],
            options={
                'verbose_name': 'Населений пункт',
                'verbose_name_plural': 'Населені пункти',
                'unique_together': {('name', 'district')},
            },
        ),
    ]