+ GET     localhost:3000/users?records=10
> создать указанное количество новых данных в файле

+ GET     localhost:3000/users?id=1       
> получить данные по номеру id

+ POST    localhost:3000/users            
> считать данные из файла с JSON

+ DELETE  localhost:3000/users?id=1       
> удаление записи по id

+ PUT     localhost:3000/users            
> добавление новых записей, в body передаем json для добавления с заполенными полями
```
{
 "name": "Zelda",
 "username": "Ronaldo99",
 "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/pechkinator/128.jpg",
 "email": "Pasquale_Fisher28@gmail.com",
 "phone": "(913) 103-6225"
}
```

+ PATCH   localhost:3000/users?id=1       
> редактировать данные, выбранные по id, в body передаем отредактированное поле
```
{
 "name": "Bukovski"
}
```
