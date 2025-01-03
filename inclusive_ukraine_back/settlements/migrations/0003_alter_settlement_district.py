# Generated by Django 5.1.4 on 2024-12-31 12:11

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('settlements', '0002_district_bounds_settlement_bounds'),
    ]

    operations = [
        migrations.AlterField(
            model_name='settlement',
            name='district',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='settlements', to='settlements.district', verbose_name='Район'),
        ),
    ]