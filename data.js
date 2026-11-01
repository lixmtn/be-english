// Nội dung học — mỗi unit = 1 chủ đề như bài trên lớp.
// item: { w: từ tiếng Anh, vi: nghĩa, e: emoji } hoặc { bear:'head' } / { color:'#hex' } / { shape:'circle' } / { num:3 }
const UNITS = [
  { id: 'body', title: 'My Body', vi: 'Cơ thể (Gấu)', icon: '🧸', hue: '#f08a5d', kind: 'body',
    items: [
      { w: 'head', vi: 'cái đầu', bear: 'head' },
      { w: 'body', vi: 'thân mình', bear: 'body' },
      { w: 'arms', vi: 'cánh tay', bear: 'arms' },
      { w: 'hands', vi: 'bàn tay', bear: 'hands' },
      { w: 'legs', vi: 'cái chân', bear: 'legs' },
      { w: 'feet', vi: 'bàn chân', bear: 'feet' },
    ] },
  { id: 'face', title: 'My Face', vi: 'Khuôn mặt', icon: '😊', hue: '#e86a92',
    items: [
      { w: 'eyes', vi: 'mắt', e: '👀' }, { w: 'ears', vi: 'tai', e: '👂' },
      { w: 'nose', vi: 'mũi', e: '👃' }, { w: 'mouth', vi: 'miệng', e: '👄' },
      { w: 'teeth', vi: 'răng', e: '🦷' }, { w: 'hair', vi: 'tóc', e: '💇' },
    ] },
  { id: 'animals', title: 'Animals', vi: 'Con vật', icon: '🐶', hue: '#57b894',
    items: [
      { w: 'cat', vi: 'con mèo', e: '🐱' }, { w: 'dog', vi: 'con chó', e: '🐶' },
      { w: 'fish', vi: 'con cá', e: '🐟' }, { w: 'bird', vi: 'con chim', e: '🐦' },
      { w: 'duck', vi: 'con vịt', e: '🦆' }, { w: 'cow', vi: 'con bò', e: '🐮' },
      { w: 'pig', vi: 'con heo', e: '🐷' }, { w: 'lion', vi: 'sư tử', e: '🦁' },
      { w: 'elephant', vi: 'con voi', e: '🐘' }, { w: 'monkey', vi: 'con khỉ', e: '🐵' },
    ] },
  { id: 'colors', title: 'Colors', vi: 'Màu sắc', icon: '🎨', hue: '#7a7fe8',
    items: [
      { w: 'red', vi: 'màu đỏ', color: '#ef4444' }, { w: 'blue', vi: 'xanh dương', color: '#3b82f6' },
      { w: 'yellow', vi: 'màu vàng', color: '#facc15' }, { w: 'green', vi: 'xanh lá', color: '#22c55e' },
      { w: 'orange', vi: 'màu cam', color: '#fb923c' }, { w: 'purple', vi: 'màu tím', color: '#a855f7' },
      { w: 'pink', vi: 'màu hồng', color: '#f9a8d4' }, { w: 'brown', vi: 'màu nâu', color: '#92603a' },
      { w: 'black', vi: 'màu đen', color: '#222222' }, { w: 'white', vi: 'màu trắng', color: '#ffffff' },
    ] },
  { id: 'fruits', title: 'Fruits', vi: 'Trái cây', icon: '🍎', hue: '#ef6b57',
    items: [
      { w: 'apple', vi: 'quả táo', e: '🍎' }, { w: 'banana', vi: 'quả chuối', e: '🍌' },
      { w: 'orange', vi: 'quả cam', e: '🍊' }, { w: 'grapes', vi: 'quả nho', e: '🍇' },
      { w: 'strawberry', vi: 'dâu tây', e: '🍓' }, { w: 'watermelon', vi: 'dưa hấu', e: '🍉' },
      { w: 'mango', vi: 'quả xoài', e: '🥭' }, { w: 'pear', vi: 'quả lê', e: '🍐' },
    ] },
  { id: 'numbers', title: 'Numbers', vi: 'Số 1–10', icon: '🔢', hue: '#f2a93b',
    items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n, i) => ({
      w: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][i], vi: 'số ' + n, num: n })) },
  { id: 'shapes', title: 'Shapes', vi: 'Hình khối', icon: '🔺', hue: '#4fb3d9',
    items: [
      { w: 'circle', vi: 'hình tròn', shape: 'circle' }, { w: 'square', vi: 'hình vuông', shape: 'square' },
      { w: 'triangle', vi: 'tam giác', shape: 'triangle' }, { w: 'star', vi: 'ngôi sao', shape: 'star' },
      { w: 'heart', vi: 'trái tim', shape: 'heart' }, { w: 'rectangle', vi: 'chữ nhật', shape: 'rectangle' },
    ] },
  { id: 'family', title: 'My Family', vi: 'Gia đình', icon: '👨‍👩‍👧‍👦', hue: '#c77dde',
    items: [
      { w: 'mommy', vi: 'mẹ', e: '👩' }, { w: 'daddy', vi: 'bố', e: '👨' },
      { w: 'baby', vi: 'em bé', e: '👶' }, { w: 'brother', vi: 'anh/em trai', e: '👦' },
      { w: 'sister', vi: 'chị/em gái', e: '👧' }, { w: 'grandma', vi: 'bà', e: '👵' },
      { w: 'grandpa', vi: 'ông', e: '👴' },
    ] },
  { id: 'toys', title: 'Toys', vi: 'Đồ chơi', icon: '🧸', hue: '#e9b949',
    items: [
      { w: 'ball', vi: 'quả bóng', e: '⚽' }, { w: 'teddy bear', vi: 'gấu bông', e: '🧸' },
      { w: 'car', vi: 'xe hơi', e: '🚗' }, { w: 'kite', vi: 'con diều', e: '🪁' },
      { w: 'blocks', vi: 'xếp hình', e: '🧱' }, { w: 'robot', vi: 'người máy', e: '🤖' },
      { w: 'doll', vi: 'búp bê', e: '🪆' }, { w: 'train', vi: 'tàu hỏa', e: '🚂' },
    ] },
  { id: 'food', title: 'Food', vi: 'Đồ ăn', icon: '🍞', hue: '#d9884f',
    items: [
      { w: 'milk', vi: 'sữa', e: '🥛' }, { w: 'bread', vi: 'bánh mì', e: '🍞' },
      { w: 'rice', vi: 'cơm', e: '🍚' }, { w: 'egg', vi: 'trứng', e: '🥚' },
      { w: 'cake', vi: 'bánh kem', e: '🍰' }, { w: 'juice', vi: 'nước ép', e: '🧃' },
      { w: 'water', vi: 'nước', e: '💧' }, { w: 'cookie', vi: 'bánh quy', e: '🍪' },
    ] },
  { id: 'clothes', title: 'Clothes', vi: 'Quần áo', icon: '👕', hue: '#5d9cec',
    items: [
      { w: 'shirt', vi: 'áo', e: '👕' }, { w: 'pants', vi: 'quần', e: '👖' },
      { w: 'dress', vi: 'váy', e: '👗' }, { w: 'hat', vi: 'cái mũ', e: '👒' },
      { w: 'shoes', vi: 'giày', e: '👟' }, { w: 'socks', vi: 'tất', e: '🧦' },
    ] },
  { id: 'vehicles', title: 'Vehicles', vi: 'Xe cộ', icon: '🚌', hue: '#48b5a3',
    items: [
      { w: 'car', vi: 'xe hơi', e: '🚗' }, { w: 'bus', vi: 'xe buýt', e: '🚌' },
      { w: 'train', vi: 'tàu hỏa', e: '🚆' }, { w: 'plane', vi: 'máy bay', e: '✈️' },
      { w: 'boat', vi: 'thuyền', e: '⛵' }, { w: 'bike', vi: 'xe đạp', e: '🚲' },
      { w: 'truck', vi: 'xe tải', e: '🚚' },
    ] },
];

// Phonics A–Z: chữ + từ khóa + emoji (theo kiểu sách phonics mẫu giáo)
const PHONICS = [
  ['a', 'apple', '🍎'], ['b', 'ball', '⚽'], ['c', 'cat', '🐱'], ['d', 'dog', '🐶'],
  ['e', 'egg', '🥚'], ['f', 'fish', '🐟'], ['g', 'goat', '🐐'], ['h', 'hat', '👒'],
  ['i', 'igloo', '🛖'], ['j', 'juice', '🧃'], ['k', 'kite', '🪁'], ['l', 'lion', '🦁'],
  ['m', 'monkey', '🐵'], ['n', 'nose', '👃'], ['o', 'octopus', '🐙'], ['p', 'pig', '🐷'],
  ['q', 'queen', '👸'], ['r', 'rabbit', '🐰'], ['s', 'sun', '☀️'], ['t', 'tiger', '🐯'],
  ['u', 'umbrella', '☂️'], ['v', 'van', '🚐'], ['w', 'watch', '⌚'], ['x', 'fox', '🦊'],
  ['y', 'yo-yo', '🪀'], ['z', 'zebra', '🦓'],
].map(([l, w, e]) => ({ l, w, e }));

const STICKERS = ['🦄', '🦖', '🐻', '🐼', '🦊', '🐸', '🐙', '🦋', '🐳', '🦁', '🐯', '🐰', '🐨', '🐧', '🦕', '🐝', '🌈', '⭐', '🚀', '🍭', '🎈', '🍩', '🌻', '🍉', '🚂', '🏰', '🎠', '🪐', '🐬', '🦉'];
