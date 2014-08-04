from django.contrib.auth.models import User
from django.db import models

# Create your models here.


class Score(models.Model):
    choices = (("snake", "snake"),
               ("mind", 'mind'),)
    player = models.ForeignKey(User)
    score = models.PositiveSmallIntegerField()
    date = models.DateTimeField(auto_now_add=True)
    game = models.CharField(choices=choices, default="Snake", max_length=40)

    def __unicode__(self):
        return "{} {}".format(self.player, self.score)