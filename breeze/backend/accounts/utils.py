from os import access
from decouple import config
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from functools import wraps

import requests

REST_API_KEY = config('REST_API_KEY')
User = get_user_model()

def check_login(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        try: 
            user_id = request.headers["X-Id"]
            access_token = request.headers["Authorization"].split()[1]

            token_status = get_token_status(access_token)
            user = User.objects.get(id=user_id)
            request.user = user
            
            if token_status == 200:
                request.access_token = 0
            else:
                refresh_token = user.token
                new_access_token, new_refresh_token = update_token(refresh_token)
                if new_refresh_token:
                    user.token = new_refresh_token
                    user.save()
                    user_update = User.objects.get(id=user_id)
                    request.user = user_update
                request.access_token = new_access_token

        except User.DoesNotExist:
            return JsonResponse({'message' : 'INVALID_USER'}, status=400)
        
        return func(request, *args, **kwargs)
    return wrapper


def get_token_status(access_token):
    headers = {
        'Authorization': f'Bearer {access_token}',
    }
    response = requests.get('https://kapi.kakao.com/v1/user/access_token_info', headers=headers)
    
    return response.status_code


def update_token(refresh_token):
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    data = {
        'grant_type': 'refresh_token',
        'client_id': REST_API_KEY,
        'refresh_token': refresh_token,
    }

    response = requests.post('https://kauth.kakao.com/oauth/token', headers=headers, data=data).json()

    new_access_token = response.get('access_token')
    new_refresh_token = response.get('refresh_token')
    return [new_access_token, new_refresh_token]