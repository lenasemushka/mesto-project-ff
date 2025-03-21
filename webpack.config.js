const path = require('path'); // подключила path к конфигу вебпак
const HtmlWebpackPlugin = require('html-webpack-plugin'); // подключила плагин 
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // подключила плагин 
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // подключила к проекту mini-css-extract-plugin

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      main: './src/index.js' 
  },
  // указали первое место, куда заглянет webpack, — файл index.js в папке src 
  output: {
    path: path.resolve(__dirname, 'dist'),
    // переписали точку выхода, используя утилиту path 
    filename: 'main.js',
    publicPath: './',
},
// указали, в какой файл будет собираться весь js, и дали ему имя 
  mode:  isProduction ? 'production' : 'development', // добавили режим разработчика
  devServer: {
    static: path.resolve(__dirname, './dist'), // путь, куда "смотрит" режим разработчика
    open: true, // сайт будет открываться сам при запуске npm run dev
    compress: true, // это ускорит загрузку в режиме разработки
    port: 8080 // порт, чтобы открывать сайт по адресу localhost:8080, но можно поменять порт
  },
  module: {
    // rules — это массив правил
    // добавим в него объект правил для бабеля
    rules: [{
        // регулярное выражение, которое ищет все js файлы
        test: /\.js$/,
        // при обработке этих файлов нужно использовать babel-loader
        use: 'babel-loader',
        // исключает папку node_modules, файлы в ней обрабатывать не нужно
        exclude: '/node_modules/'
      },
      // добавили правило для обработки файлов
      {
        // регулярное выражение, которое ищет все файлы с такими расширениями
        test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext][query]'
        }
      },
      {
        // применять это правило только к CSS-файлам
        test: /\.css$/,
        // при обработке этих файлов нужно использовать
        // MiniCssExtractPlugin.loader и css-loader
        use: [MiniCssExtractPlugin.loader, {
          loader: 'css-loader',
          // добавьте объект options
          options: { 
            importLoaders: 1 
          }
        },
        // Добавьте postcss-loader
        'postcss-loader'
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html' // путь к файлу index.html
    }),
    new CleanWebpackPlugin(), // использовали плагин
    new MiniCssExtractPlugin(), // подключение плагина для объединения файлов
  
  ] // добавьте массив
}
}



// module.exports — это синтаксис экспорта в Node.js