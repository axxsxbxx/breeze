from django.http.response import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from decouple import config

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

import requests


REST_API_KEY = config('REST_API_KEY')
User = get_user_model()

    # 
    # 아니면 그냥 실행
    
    # 엑세스? 토큰 검사? 
    
    # 토큰을 바탕으로 회원아이디, 이름 -- 또 요청 보내야함
    

    # 우리 모델안에 이 회원의 아이디가 존재하지 않으면 회원가입 시켜야함
    # 존재하면 그냥 로그인 
    
# 로그인 전체 로직 ===========================================================
@api_view(['GET'])
def login(request):
    # 코드로 토큰 받아오기
    # 토큰 받아옴: Access Token, Refresh Token
    # Access Token으로 사용자 인증 및 카카오 API 호출 권한 부여
    # Refresh Token으로 Access Token 발급
    code = request.GET.get('code')

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    data = {
        'grant_type': 'authorization_code',
        'client_id': REST_API_KEY,
        'code': code,
    }
    
    response = requests.post('https://kauth.kakao.com/oauth/token', headers=headers, data=data).json()

    access_token = response.get('access_token')
    refresh_token = response.get('refresh_token')
    
    token_status = get_token_status(access_token)
    
    if token_status == 200:
        # 바로 회원정보 가져오기
        user_info = get_user_info(access_token, refresh_token)
    else:
        # 토큰 갱신하고 회원정보 가져오기
        new_access_token, new_refresh_token = update_token(refresh_token)
        if not new_refresh_token:
            refresh_token = new_refresh_token
        user_info = get_user_info(new_access_token, refresh_token)
        
    return Response(data=user_info, status=status.HTTP_201_CREATED)


# 토큰 유효성 확인 함수 ===========================================================
def get_token_status(access_token):
    # 토큰 정보보기 -- 만료되었다고 뜨면 -- 리프레시 토큰으로 갱신
    headers = {
        'Authorization': f'Bearer {access_token}',
    }

    response = requests.get('https://kapi.kakao.com/v1/user/access_token_info', headers=headers)
    
    # 200 / 400 / 401
    return response.status_code


# 유저 정보 가져오는 함수===========================================================
def get_user_info(access_token, refresh_token):
    headers = {
        'Authorization': f'Bearer {access_token}',
    }

    profile_json = requests.get('https://kapi.kakao.com/v2/user/me', headers=headers).json()
    user_id = profile_json.get('id')
    user_name = profile_json.get('kakao_account')
    print(user_name)
    user_name = user_name.get('profile').get('nickname')
    # 우리 모델에 얘가 존재하지 않으면 회원가입
    if not User.objects.filter(id = user_id).exists():
        new_user = User(
            id = user_id,
            username = user_name,
            token = refresh_token,
        )
        new_user.save()
        
    user_info = {
        'username': user_name,
        'access_token': access_token,
        'refresh_token': refresh_token,
    }

    return user_info


# 토큰 갱신하는 함수===========================================================
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
    
    
@api_view(['POST'])
def logout(request):
    pass