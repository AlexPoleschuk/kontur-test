const { getAllFilePathsWithExtension, readFile } = require("./fileSystem");
const { readLine } = require("./console");

app();

function app() {
  console.log("Please, write your command!");
  readLine(processCommand);
}

// getFiles() получает из потока коллекцию объектов [...{filePath, data}]
function getFiles() {
  const filePaths = getAllFilePathsWithExtension(process.cwd(), "js");
  let result = [];

 filePaths.map((filePath) =>
    result.push({ fname: filePath, data: readFile(filePath) }));
  
  return result;
}

// destructData() создает на основе коллекции [...{filePath, data}] массив объектов [...{comment}]
function destructData() {
  let result = getFiles()
    .map(curFile => getData(curFile.fname, curFile.data))
    .reduce((acc, cur) => acc.concat(cur));
  return result;
}

// класс-конструктор для экземпляра комментария TO-DO
class comment {
  constructor(name = "", date = "", text, importance = 0, fileName = "") {
    this.name = name;
    this.date = date;
    this.text = text;
    this.importance = importance;
    this.fileName = fileName;
  }
}

// обработчик {filePath, data} => [...{comment}] для каждого файла
function getData(fname, data) {
  let arr = data
    .split("//")
    .filter(str => str.toUpperCase().includes("TO" + "DO"))
    .map(str => {
      return str.slice(
        str.toUpperCase().indexOf("TO" + "DO ") + 5,
        str.indexOf("\n")
      );
    });
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    let mut = [],
      count = new comment();

    count.importance = arr[i].split("!").length - 1;
    count.fileName = fname.slice(
      fname.lastIndexOf("/") + 1,
      fname.lastIndexOf(".js") + 3
    );
    if (arr[i].includes(";")) {
      mut = arr[i].split(";");
      count.name = mut[0].trim();
      count.date = mut[1].trim();
      count.text = mut[2].trim();
    } else count.text = arr[i].trim();

    res.push(count);
  }

  return res;
}

// обработчик команд
function processCommand(command) {
  if (command.indexOf("user") === 0) {
    userF(destructData(), command.slice(5));
  } else if (command.indexOf("sort") === 0) {
    sortF(destructData(), command.slice(5));
  } else if (command.indexOf("date") === 0) {
    dateF(destructData(), command.slice(5));
  } else {
    switch (command) {
      case "exit":
        process.exit(0);
        break;
      case "show":
        showF(destructData());
        break;
      case "important":
        importantF(destructData());
        break;
      default:
        console.log("wrong command");
        break;
    }
  }
}
// TODO you can do it!

// найти все TO-DO
function showF(arr) {
  view(arr);
}

// найти TO-DO c '!'
function importantF(arr) {
  let res = arr.filter(comment => comment.importance > 0);
  view(res);
}

// найти TO-DO от указанного пользователя
function userF(arr, username) {
  let res = arr.filter(comment =>
    comment.name.toUpperCase().includes(username.toUpperCase())
  );
  view(res);
}

// сортировка TO-DO по важности / пользователям / дате
function sortF(arr, param) {
  let res = [];

  if (/importance/i.test(param)) {
    res = arr.sort((a, b) => b.importance - a.importance);
  }
  if (/user/i.test(param)) {
    res = arr.sort(function(a, b) {
      if (!a.name) {
        return 1;
      }
      if (!b.name) {
        return -1;
      } else return a.name.localeCompare(b.name);
    });
  }
  if (/date/i.test(param)) {
    res = arr.sort(function(a, b) {
      if (!a.date) {
        return 1;
      }
      if (!b.date) {
        return -1;
      } else return new Date(b.date) - new Date(a.date);
    });
  }
  view(res);
}

// найти TO-DO от указанной даты и позже
function dateF(arr, date) {
  let res = arr.filter(comment => new Date(comment.date) >= new Date(date));
  view(res);
}

// вывод результатов в консоль
function view(arr) {
  let hUser = "user".length,
    hDate = "date".length,
    hComment = "comment".length,
    hFileName = "fileName".length,
    cImp = "  !  ",
    cRest = "(...)";

  if (arr.length !== 0) {
    let maxis = arr.reduce(
      ([maxUser, maxDate, maxComment, maxFileName], cur) => [
        Math.max(maxUser, cur.name.length),
        Math.max(maxDate, cur.date.length),
        Math.max(maxComment, cur.text.length),
        Math.max(maxFileName, cur.fileName.length)
      ],
      [0, 0, 0, 0]
    );

    let maxUserColumnLength =
        maxis[0] < hUser ? hUser : maxis[0] < 10 ? maxis[0] : 10,
      maxDateColumnLength =
        maxis[1] < hDate ? hDate : maxis[1] < 10 ? maxis[1] : 10,
      maxCommentColumnLength =
        maxis[2] < hComment ? hComment : maxis[2] < 50 ? maxis[2] : 50,
      maxFileNameColumnLength = maxis[3] < 15 ? maxis[3] : 15,
      header = headConstructor(
        maxUserColumnLength,
        maxDateColumnLength,
        maxCommentColumnLength,
        maxFileNameColumnLength
      );
    console.log(header);

    arr.map(function(c) {
      c.importance = c.importance > 0 ? cImp : " ".repeat(cImp.length);
      c.name = strConstructor(c.name, maxUserColumnLength);
      c.date = strConstructor(c.date, maxDateColumnLength);
      c.text = strConstructor(c.text, maxCommentColumnLength);
      c.fileName = strConstructor(c.fileName, maxFileNameColumnLength);

      console.log(
        `${c.importance}|${c.name}|${c.date}|${c.text}|${c.fileName}`
      );
    });

    console.log(header.slice(header.indexOf("\n") + 1, header.length));
  } else console.log(headConstructor());
  
  // конструктор для header и footer таблицы результатов
  function headConstructor(u = hUser, d = hDate, c = hComment, f = hFileName) {
    let header =
      `  !  |` +
      `  user  ${" ".repeat(u - hUser)}|` +
      `  date  ${" ".repeat(d - hDate)}|` +
      `  comment  ${" ".repeat(c - hComment)}|` +
      `  fileName  ${" ".repeat(f - hFileName)}`;

    return `${header}\n${"-".repeat(header.length)}`;
  }

  // конструктор для строки в таблице результатов
  function strConstructor(item, max) {
    return max - item.length >= 0
      ? `  ${item}${" ".repeat(max - item.length)}  `
      : `  ${item.slice(0, max - cRest.length)}${cRest}  `;
  }
}
