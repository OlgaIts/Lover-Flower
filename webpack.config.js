const path = require('path');
// Плагин для работы с html файлами
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Плагин для компиляции CSS в отдельные файлы
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// Плагин для оптимизации изображений
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
// Плагин для минификации JS
const TerserWebpackPlugin = require('terser-webpack-plugin');
// Плагин для минификации CSS
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

const basePath = path.resolve(__dirname, 'src');
// переменные режима разработки для использования в оптимизации конфига
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

// функция для настройки оптимизации для режима dev и prod
const optimization = () => {
	const config = {
		// настройка для исключения повторения кода подключаемых библиотек в бандле
		splitChunks: {
			chunks: 'all',
		},
	};

	if (isProd) {
		// настройка оптимизации изображений и минификации кода при сборке
		config.minimizer = [
			// минификация js файлов + удаление комментариев
			new TerserWebpackPlugin({
				terserOptions: {
					format: {
						comments: false,
					},
				},
				extractComments: false,
			}),
			// минификация css файлов + удаление комментариев
			new CssMinimizerWebpackPlugin({
				minimizerOptions: {
					preset: [
						'default',
						{
							discardComments: {removeAll: true},
						},
					],
				},
			}),
			new ImageMinimizerPlugin({
				minimizer: {
					implementation: ImageMinimizerPlugin.imageminMinify,
					options: {
						plugins: [
							['gifsicle', {interlaced: true}],
							['jpegtran', {progressive: true}],
							['optipng', {optimizationLevel: 5}],
							[
								'svgo',
								{
									plugins: [
										{
											name: 'preset-default',
											params: {
												overrides: {
													removeViewBox: false,
													addAttributesToSVGElement: {
														params: {
															attributes: [{xmlns: 'http://www.w3.org/2000/svg'}],
														},
													},
												},
											},
										},
									],
								},
							],
						],
					},
				},
			}),
		];
	}

	return config;
};

module.exports = {
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	// в какой среде будет работать итоговое приложение (web - в браузере)
	target: 'web',
	devServer: {
		// после запуска сервера автоматически открыть браузер
		open: true,
		// включает автоматическую перезагрузку страницы при изменениях в файлах
		hot: true,
	},
	// точка входа (файл, который webpack будет компилировать)
	entry: path.resolve(basePath, 'index.tsx'),
	// точка выхода (куда webpack должен складывать результаты работы)
	output: {
		path: path.resolve(__dirname, 'dist'),
		clean: true,
		filename: '[name].[contenthash:10].js',
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash:10].css',
		}),
	],
	// оптимизация и минификация файлов
	optimization: optimization(),
	// правила обработки файлов
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.(woff(2)?|eot|ttf|otf|)$/i,
				exclude: /node_modules/,
				type: 'asset/resource',
				generator: {
					filename: path.join('fonts', '[name].[contenthash:10][ext]'),
				},
			},
			{
				test: /\.ico$/i,
				type: 'asset/resource',
				generator: {
					filename: path.join('img', '[name].[contenthash:10][ext]'),
				},
			},
			{
				test: /\.(png|jpe?g|gif|svg|webp)$/i,
				exclude: /node_modules/,
				type: 'asset/resource', //  type: 'asset/resource',? да, тоже смотрю что resource вроде нужне
				generator: {
					filename: path.join('img', '[name].[contenthash:10][ext]'),
				},
			},
			{
				test: /\.s?css$/i,
				exclude: /node_modules/,
				use: [
					// MiniCssExtractPlugin.loader, это для prod версии минификация!!!!!!да заработало пушка
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: {
								localIdentName: '[name]__[local]--[hash:base64:5]',
								auto: (resPath) => !!resPath.includes('.module.'),
							},
						},
					},
					'postcss-loader', //не уверен что он тут нужен
					'sass-loader',
				],
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.tsx', '...'],
		alias: {
			'@app': path.resolve(basePath, 'app'),
			'@pages': path.resolve(basePath, 'pages'),
			'@widgets': path.resolve(basePath, 'widgets'),
			'@features': path.resolve(basePath, 'features'),
			'@entities': path.resolve(basePath, 'entities'),
			'@shared': path.resolve(basePath, 'shared'),
			'@types': path.resolve(basePath, 'types'),
			'@icons': path.resolve(basePath, 'assets/icons'),
			'@images': path.resolve(basePath, 'assets/img'),
		},
	},
};
