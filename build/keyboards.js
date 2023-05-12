import { Markup } from "telegraf";
export function getMainMenu() {
    return Markup.keyboard([["Начать беседу", "Закончить беседу"]]).resize();
}
