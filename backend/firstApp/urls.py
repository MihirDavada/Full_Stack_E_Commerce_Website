"""
backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from . import views

urlpatterns = [
    path('showProducts/getTopProducts', views.getTopProducts , name='get_Top_Products'),
    path('reviews/<str:productSlug>/rating', views.createProductReview, name='createProductReview'),
    path('order/<str:pk>/isDelivered', views.updateOrderToDelivered, name='Is_Delivered'),
    path('admin/getOrders/', views.getOrders, name='get_orders'),
    path('admin/uploadImage/', views.uploadImage, name='upload_The_Image'),
    path('productDetails/<str:pk>', views.productDetailById , name='product_Detail_Detail_By_Id'),
    path('admin/updateProduct/<str:pk>', views.updateProduct, name='update_the_product'),
    path('admin/createProduct/', views.createProduct, name='create_product'),
    path('admin/deleteProduct/<str:pk>', views.deleteProducts, name='delete_product'),
    path('admin/updateUser/<str:pk>', views.updateUser, name='update_the_user'),
    path('admin/getUser/<str:pk>', views.getUserById, name='Get_User_By_Id'),
    path('admin/deleteUser/<str:pk>', views.deleteUser, name='delete_the_user'),
    path('admin/users/', views.getAllUsers, name='get_all_users'),
    path('orders/getAllOrders', views.getAllOrders, name='get_all_orders'),
    path('order/<str:pk>/isPaid', views.updateOrderIsPaid, name='update_Order_Is_Paid'),
    path('order/<str:pk>', views.getOrderById, name='Get_Order_By_Id'),
    path('orders/addOrderItems', views.addOrderItems, name='Add_Order_Items'),
    path('user/updateProfile', views.updateUserProfile, name='user_update_profile'),
    path('user/getUsers/', views.getAllUsers, name='get_all_users'),
    path('user/register/', views.registerUser, name='register_user'),
    path('user/profile', views.userProfile, name='user_profile'),
    path('user/login', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('productDetail/<str:productSlug>', views.productDetail , name='productDetail'),
    path('showProducts', views.showProducts , name='show_all_products'),
]

