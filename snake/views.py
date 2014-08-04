import json
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render

# Create your views here.
from django.views.decorators.csrf import csrf_exempt
from snake.forms import EmailUserCreationForm
from snake.models import Score


def home(request):
    return render(request, 'home.html')

@login_required
def snake(request):
    return render(request, 'snake.html')

@login_required
def profile(request):
    return render(request, 'profile.html')


def register(request):
    if request.method == 'POST':
        form = EmailUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            new_user = authenticate(username=request.POST['username'],
                                    password=request.POST['password1'])
            login(request, new_user)
            return HttpResponseRedirect(reverse("snake"))

    else:
        form = EmailUserCreationForm()

    return render(request, "registration/register.html", {
        'form': form,
    })




@csrf_exempt
def new_score(request):
    if request.method == "POST":
        data = json.loads(request.body)
        game = data['game']
        score = data['score']
        player = request.user

        new_save = Score.objects.create(
            game=game, score=score, player=player)
        score_info ={
            'player': new_save.player.username,
            'score': new_save.score,
            'game': new_save.game
        }
        return HttpResponse(json.dumps(score_info), content_type='application/json')
