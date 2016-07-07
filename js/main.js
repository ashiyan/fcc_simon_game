/* jshint browser: true */

document.addEventListener( "DOMContentLoaded", function() {
	
	// Уровень игры
	var level = 1;
	
	// Текущий прогресс повторения мелодии
	var current = 0;
	
	// Массив для сохранения мелодии
	var melody = [];
	
	// Флаг контроля включения и выключения
	var power = false;
	
	// nod-лист с элементами - ячейками
	var btns = document.querySelectorAll(".btn");
	
	var audio = {};
	audio.green = new Audio();
	audio.red = new Audio();
	audio.blue = new Audio();
	audio.yellow = new Audio();
	audio.error = new Audio();
	audio.green.src = "/sound/simonSound1.mp3";
	audio.red.src = "/sound/simonSound2.mp3";
	audio.blue.src = "/sound/simonSound3.mp3";
	audio.yellow.src = "/sound/simonSound4.mp3";
	audio.error.src = "/sound/error.mp3";
	
	
	// Фукция обновления мелодии (добавления уровня)
	function update_melody() {
		
		// Все варианты
		var palette = ["green", "red", "blue", "yellow"];
		
		// Добавление случайного варианта из 4-х
		melody.push(palette[Math.floor(Math.random() * 4)]);
		
		// Проигрывание мелодии после обновления
		play_melody();
	}
	
	// Функция проигрывания мелодии и показ анимации на кнопках
	function play_melody() {
		
		// Счетчик для остановки анимации
		var i = 0;
		
		// Анимация подсвечивания кнопки и блокировки кнопок во время анимации
		var light_on = function() {
			unsubscribe();
			if (i === melody.length) { clearInterval(first_animation); subscribe(); }
			document.querySelector("." + melody[i]).style.WebkitFilter = "brightness(2)";
			document.querySelector("." + melody[i]).style.filter = "brightness(2)";
			audio[melody[i]].play();
		};
		
		// Анимация возвращения обычного цвета кнопкам
		var light_off = function() {
			if (i === melody.length) clearInterval(second_animation);
			document.querySelector("." + melody[i]).style.WebkitFilter = "brightness(1)";
			document.querySelector("." + melody[i]).style.filter = "brightness(1)";
			audio[melody[i]].pause();
			audio[melody[i]].currentTime = 0;
			i++;
		};

		// Запуск анимаций
		var first_animation = setInterval(light_on, 400);
		var second_animation = setInterval(light_off, 800);
		
	}
	
	// Обработка нажатий на цветные кнопки
	function press_btn(event) {
		
		var button = event.target.classList[1];
		
		// Ошибка при нажатии - сброс текущего прогресса и повторное проигрывание мелодии
		if (button !== melody[current]) {
			audio.error.play();
			current = 0;
			play_melody();
		}
		
		// Вся мелодия успешно пройдена - повышение уровня и отображение его на дисплее, сброс текущего прогресса и обновление мелодии
		else if (current === level - 1) {
			document.querySelector(".count").innerHTML = level < 10 ? "0" + (++level) : (++level);
			current = 0;
			update_melody();
		}
		
		// Правильное нажатие - повышение уровня прогресса
		else current++;
		
	}
	
	// Обработка нажатия и отпускания кнопки мыши (изменение тени кнопок)
	function mouse_down(event) {
		audio[event.target.classList[1]].play();
		document.querySelector("." + event.target.classList[1]).style.boxShadow = "0 0 25px rgba(0,0,0,.5) inset";
	}
	function mouse_up(event) {
		audio[event.target.classList[1]].pause();
		audio[event.target.classList[1]].currentTime = 0;
		document.querySelector("." + event.target.classList[1]).style.boxShadow = "2px 2px 10px rgba(0,0,0,.8)";
	}
		
	// Функция подписки кнопок на события
	function subscribe() {
		for (var i = 0; i < btns.length; i++) {
			btns[i].addEventListener("click", press_btn);
			btns[i].addEventListener("mousedown", mouse_down);
			btns[i].addEventListener("mouseup", mouse_up);
		}
	}
	
	// Функция отписки кнопок от событий
	function unsubscribe() {
		for (var i = 0; i < btns.length; i++) {
			// ...на событие клика мышью
			btns[i].removeEventListener("click", press_btn);
			btns[i].removeEventListener("mousedown", mouse_down);
			btns[i].removeEventListener("mouseup", mouse_up);
		}
	}
	
	// Подписка кнопки питания на событие клика
	document.querySelector(".btn_start").addEventListener("click", function() {
		
		// При нажатии на кнопку питания всегда сбрасывается уровень, текущий прогресс и мелодия
		level = 1;
		current = 0;
		melody = [];
		
		// При включении питания...
		if (!power) {
			
			// Активируем кнопки
			subscribe();
			
			// Изменение цвета кнопки на зеленый и тени кнопки
			document.querySelector(".btn_start").style.backgroundColor = "#249f24";
			document.querySelector(".btn_start").style.boxShadow = "1px 1px 3px 1px black inset";
			
			// Отображение счетчика уровня
			document.querySelector(".count").innerHTML = "0" + level;
			
			// Обновление мелодии
			update_melody();
			
			// Флаг включения
			power = true;
		}
		
		// При выключении питания...
		else {
			
			// Запрещаем нажимать на кнопки
			subscribe();
			
			// Изменение цвета кнопки на красный и тени кнопки
			document.querySelector(".btn_start").style.backgroundColor = "#aa1717";
			document.querySelector(".btn_start").style.boxShadow = "0 0 10px 1px rgba(0,0,0,.5)";
			
			// Скрытие счетчика уровня
			document.querySelector(".count").innerHTML = "";
			
			// Флаг выключения
			power = false;
		}
	});
	
});