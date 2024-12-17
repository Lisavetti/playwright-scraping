const axios = require("axios");
const fs = require("fs");

// Binance API URL для ордербука
const BASE_URL = "https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=10";

; (async () => {
    try {
        // Запрос данных с Binance API
        const response = await axios.get(BASE_URL);

        // Обрабатываем данные ордербука
        const bids = response.data.bids; // Покупка: [[цена, количество]]
        const asks = response.data.asks; // Продажа: [[цена, количество]]

        // Получаем текущую дату и время
        const timestamp = new Date().toISOString();

        // Формируем массив с 10 парами значений
        const orderbook = [];
        for (let i = 0; i < 10; i++) {
            orderbook.push({
                time: timestamp,
                buy: {
                    price: parseFloat(bids[i][0]),      // Лучшая цена на покупку
                    quantity: parseFloat(bids[i][1])   // Количество на покупку
                },
                sell: {
                    price: parseFloat(asks[i][0]),     // Лучшая цена на продажу
                    quantity: parseFloat(asks[i][1])   // Количество на продажу
                }
            });
        }

        // Выводим результат
        console.log(orderbook);

        // Сохранение данных в файл
        fs.writeFileSync("orderbook.json", JSON.stringify(orderbook, null, 2));
        console.log("Данные сохранены в orderbook.json");

    } catch (error) {
        console.error("Ошибка получения данных:", error.message);
    }
})();
