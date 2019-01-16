from django.shortcuts import redirect, get_object_or_404
from django.template.loader import render_to_string
from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.contrib.auth.tokens import default_token_generator
from django.http import JsonResponse, HttpResponseBadRequest
from django.utils.translation import ugettext_lazy as _

from . import forms
from .actions import ActivateUser
from conferences.models import Zosia, UserPreferences
from .models import Organization
from .forms import OrganizationForm


# Create your views here.
@login_required
@require_http_methods(['GET'])
def profile(request):
    current_zosia = Zosia.objects.find_active()
    user_preferences = UserPreferences.objects.select_related(
        'bus', 'zosia').filter(user=request.user)

    current_prefs = user_preferences.filter(zosia=current_zosia).first()
    all_prefs = user_preferences.exclude(zosia=current_zosia).values_list(
        'zosia', flat=True)

    ctx = {
        'zosia': current_zosia,
        'current_prefs': current_prefs,
        'all_prefs': all_prefs
    }
    return render_to_string(request, 'users/profile.html', ctx)


@require_http_methods(['GET', 'POST'])
def signup(request):
    form = forms.UserForm(request.POST or None)
    ctx = {
        'form': form,
    }

    if request.method == 'POST':
        if form.is_valid():
            form.save(request)
            return render_to_string(request, 'users/signup_done.html', ctx)

    return render_to_string(request, 'users/signup.html', ctx)


@login_required
@require_http_methods(['GET', 'POST'])
def account_edit(request):
    form = forms.EditUserForm(request.POST or None, instance=request.user)
    if form.is_valid():
        form.save()
        return redirect('accounts_profile')
    ctx = {'form': form}
    return render_to_string(request, 'users/signup.html', ctx)


@require_http_methods(['GET', 'POST'])
def activate(request, uidb64, token):
    action = ActivateUser(
        token_generator=default_token_generator,
        uidb64=uidb64,
        token=token,
    )

    if action.is_valid():
        action.call()
        login(request, action.user)
        return redirect('index')

    ctx = {
        'user': action.user,
    }
    return render_to_string(request, 'users/activate.html', ctx)


@login_required
@require_http_methods(['POST'])
def create_organization(request):
    user = request.user
    name = request.POST.get('name', None)
    if name is None:
        return HttpResponseBadRequest()
    org, _ = Organization.objects.get_or_create(user=user, name=name, accepted=False)
    return JsonResponse({'status': 'OK', 'html': name, 'value': org.pk})


@staff_member_required
@require_http_methods(['GET'])
def organizations(request):
    organizations = Organization.objects.all()
    ctx = {'organizations': organizations}
    return render_to_string(request, 'users/organizations.html', ctx)


@staff_member_required
@require_http_methods(['GET', 'POST'])
def update_organization(request, pk=None):
    if pk:
        organization = get_object_or_404(Organization, pk=pk)
        form = OrganizationForm(request.POST or None, instance=organization)
    else:
        organization = None
        form = OrganizationForm(request.POST or None)

    if form.is_valid():
        form.save()
        messages.success(request, _('Organization updated'))
        return redirect('organizations')
    ctx = {'form': form, 'organization': organization}
    return render_to_string(request, 'users/organization_form.html', ctx)


@staff_member_required
@require_http_methods(['POST'])
def toggle_organization(request):
    organization_id = request.POST.get('key', None)
    organization = get_object_or_404(Organization, pk=organization_id)
    organization.accepted = not organization.accepted
    organization.save(update_fields=['accepted'])
    return JsonResponse({'msg': "{} changed status!".format(organization)})
