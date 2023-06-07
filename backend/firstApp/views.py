from datetime import datetime
from multiprocessing.sharedctypes import Value
from .models import Product, User, Order, OrderItem, ShippingAddress, Review
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .serializing import ProductSerializer, UserSerializer, UserSerializerWithToken, OrderSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from rest_framework import status

@api_view(['GET'])
def showProducts(request):

    query = request.query_params.get('keyword')
    # print(query)
    if query == None:
        query = ''

    products = Product.objects.filter(name__icontains=query).order_by('-createdAt')
    
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def productDetail(request, productSlug):
    productDetail = Product.objects.get(product_slug = productSlug)
    serializer = ProductSerializer(productDetail, many=False)
    return Response(serializer.data)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # print(f" user is {self.user}") user is MihirDavada

        serializer = UserSerializerWithToken(self.user).data

        # print(serializer)
        # {'id': 1, '_id': 1, 'username': 'MihirDavada', 'email': 'mihirdavada41@gmail.com', 'name': 'Mihir', 'isAdmin': True, 'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjU0NTE4MTQ4LCJpYXQiOjE2NTE5MjYxNDgsImp0aSI6IjRmNDMxODViNGMyMjRmNGY5ZjhmY2NhYWJiNTM4ZDliIiwidXNlcl9pZCI6MX0.ZIFf8CQ1mqtUXD3vtCr_8xn_z4p63urAa3mOT4NM95U'}
        
        for key, value in  serializer.items():
            data[key] = value
        
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def userProfile(request):
    user = request.user
    # print(f" user is {user}")
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name = data['name'],
            username = data['email'],
            email = data['email'],
            password = make_password(data['password'])
        )

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        
        return Response('User With This Email Already Exist', status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data
    # print(data)
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']

    if data['password'] != '':
        user.password = make_password(data['password']) 

    user.save()

    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    # print(data)

    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:

        # (1) Create order

        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice']
        )

        # (2) Create shipping address

        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country'],
        )

        # (3) Create order items adn set order to orderItem relationship
        for i in orderItems:
            product = Product.objects.get(_id=i['_id'])

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=i['name'],
                qty=i['qty'],
                price=i['price'],
                image=i['image'],
            )

            # (4) Update stock
            # product.countInStock -= item.qty
            # product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):

    user = request.user

    try:
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            Response({'detail': 'Not authorized to view this order'},
                     status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def updateOrderIsPaid(request, pk):
    order = Order.objects.get(_id = pk)
    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()
    return Response('Payment Successfully')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAllOrders(request):
    user = request.user

    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

# ADMIN PANEL

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getAllUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    userDelete = User.objects.get(id = pk)
    userDelete.delete()
    return Response('User Was Deleted')


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    user = User.objects.get(id = pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request, pk):
    user = User.objects.get(id = pk)

    data = request.data
    
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['isAdmin']

    user.save()

    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProducts(request, pk):
    product = Product.objects.get(_id = pk)
    product.delete()
    return Response('Product Was Deleted')

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user

    product = Product.objects.create(
        user=user,
        name='Sample Name',
        price=0,
        brand='Sample Brand',
        countInStock=0,
        category='Sample Category',
        description='Sample Discription',
        product_slug = 'Sample-Product-Slug'
    )

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    # print(data)
    product = Product.objects.get(_id=pk)

    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.description = data['description']
    product.product_slug = data['productSlug']

    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['GET'])
def productDetailById(request, pk):
    productDetail = Product.objects.get(_id = pk)
    serializer = ProductSerializer(productDetail, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def uploadImage(request):
    data = request.data
    # print(data)
    # print(request.FILES.get('image'))

    product = Product.objects.get(_id=data['product_id'])

    product.image = request.FILES.get('image')
    product.save()

    return Response('Image was uploaded')

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id=pk)

    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()

    return Response('Order was delivered')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, productSlug):
    user = request.user
    product = Product.objects.get(product_slug=productSlug)
    data = request.data

    # 1 - Review already exists
    alreadyExists = product.review_set.filter(user=user).exists()
    # print(f" Already Exists Review is {alreadyExists}")
    if alreadyExists:
        return Response('Product already reviewed')

    # 2 - No Rating or 0
    elif data['rating'] == 0:
        return Response('Please select a rating')

    # 3 - Create review
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
        )

        reviews = product.review_set.all()
        # print(f"Reviews for particular product is {reviews}")
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

        product.rating = total / len(reviews)
        product.save()

        return Response('Review Added')

@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]

    print(products)
    # (rating__gt=4) It returns the product which rating is greater then 4
    # (rating__gte=4) It returns the product which rating is greater then or equalTo 4
    # order_by('rating') - It gives 4 rated product and then 5 rated products
    # order_by('-rating') - It gives 5 rated product and then 4 rated products

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)
