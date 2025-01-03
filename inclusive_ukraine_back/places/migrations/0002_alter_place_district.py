# Generated by Django 5.1.4 on 2024-12-31 12:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('places', '0001_initial'),
        ('settlements', '0003_alter_settlement_district'),
    ]

    operations = [
        migrations.AlterField(
            model_name='place',
            name='district',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='places', to='settlements.district', verbose_name='Район'),
        ),
    ]
