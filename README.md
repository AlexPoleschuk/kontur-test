# kontur-test

Задача: сделать консольную утилиту для фронтендера.
Утилита будет брать все файлы с расширением .js в текущей директории, находить в них
все комментарии с TODO. Искать по ним, фильтровать, сортировать.
Все однострочные TODO-комментарии имеют одинаковое начало: два слеша, слово
TODO (в любом регистре), пробел или двоеточие (или и двоеточие, и пробел; или
пробел-двоеточие-пробел; или несколько пробелов) и дальше текст комментария.
Текст комментария в todo может быть представлен обычным текстом. Или же
использовать специальную разметку:
```
// TODO {Имя автора}; {Дата комментария}; {Текст комментария}
```
После имени и даты обязательно ставится точка с запятой, а вот пробел между ними не
обязателен.

### Запуск

* `node index.js` 

### Команды, обрабатываемые приложением

* `exit` - завершение работы программы (изначально реализовано)
* `show` - показать все todo
* `important` - important : показывать только todo , в которых есть восклицательный знак.
В комментарии может присутствовать восклицательный знак (!), что означает, что
это задача с высоким приоритетом.
* `user {username}` - показывать только комментарии от указанного
пользователя. 
Имя пользователя должно быть регистронезависимо. Пример команды: " user
veronika ". Pезультат команды " user ve " должен включать в себя
такие же результаты, как и команда " user veronika ".
* `sort {importance | user | date}` - выводит отсортированные todo
Если аргумент importance , то сначала выводятся комментарии с
восклицательными знаками, потом все остальные. Чем больше
восклицательных знаков, тем выше приоритет и тем выше в списке этот
комментарий.
Если аргумент user , то выводятся задачи сгруппированные по пользователям, а в
конце безымянные.
Если аргумент date , то выводятся сначала самые новые, потом постарше, потом
без дат.
Примеры команд: " sort importance ", " sort user ", " sort date ".
* `date {yyyy[-mm-dd]}` - показывает все комментарии, созданные после
переданной даты (включительно).
Датой может быть только год, год с месяцем (через дефис) или год с месяцем и
днем.
Примеры команд: " date 2015 ", " date 2016-02 ", " date 2018-03-02 ".
В ответ на команду " date 2015 " ожидается список todo , которые были созданы в
2015 году и позже.

Если введена команда не из этого списка, то в консоль должен выводиться текст " wrong
command ".
В начале работы приложения, она должна писать в консоль приглашение ввести
команду: " Please, write your command! ".

### Формат

Выводить результаты необходимо в консоль в виде таблицы:
- каждая строка отображает один комментарий;
- у таблицы должно быть пять колонок: важность, пользователь, дата, комментарий, имя
файла (в котором найден этот todo);
- между ячейками должен быть разделитель — вертикальная черта (|). А от
вертикальной черты до текста должно быть минимум два пробела отступа. Например:
```
    ! | pe | 2018-03-02 | sdkhsdfsdf | index.js
      | pe | 2018-03-02 | sdkhsdfsdf | index.js 
```
- если в комментарии есть восклицательные знаки, то в первой колонке нужно поставить
символ !, в остальных случаях ничего не ставить;
- ширина колонок должна подбираться по самому длинному значению в колонке.
Максимальная ширина колонок, не считая отступ до вертикальных черт: 1, 10, 10, 50, 15
соответственно. При необходимости нужно обрезать значение, поставив в конце многоточие (...),
но при этом обрезанный текст вместе с многоточием должен влезть в максимальную ширину колонки;
- у таблицы должен быть заголовок:
```
    ! | user | date | comment | fileName 
```
- ширина клеток заголовка тоже должна подбираться по самому длинному значению в
этом столбце
- от остальной таблицы заголовок отделяется строкой нужной длины со знаками минус (-). Пример:
```
    ! | user | date | comment | fileName   
  ----------------------------------------
      | pe | 2012 | dddlsl | index.js       
      | pe | 2012 | dddlsl | index.js     
```
- добавить строку из минусов еще и в конце таблицы;
- вывод комментариев в командах show , important , user {username} , sort {type}
и date {date} должен отображаться в виде этой таблички.
- если нет ни одного подходящего комментария, то выводится только заголовок таблицы
и строка из минусов под ним. Пример:
```
    ! | user | date | comment | fileName
  ----------------------------------------
```