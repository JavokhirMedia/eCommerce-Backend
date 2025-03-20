import { IResponseMap } from "./types";

export const RESPONSE_PROMPTS: IResponseMap = {
    create: {
        id: 1,
        messages: {
            en: "Created successfully!",
            ru: "Успешно создан!",
            uz: "Muvaffaqiyatli yaratildi!",
        },
    },
    update: {
        id: 2,
        messages: {
            en: "Updated successfully!",
            ru: "Успешно обновлено!",
            uz: "Muvaffaqiyatli tahrirlandi!",
        },
    },
    delete: {
        id: 3,
        messages: {
            en: "Deleted successfully!",
            ru: "Успешно удалено!",
            uz: "Muvaffaqiyatli o'chirildi!",
        },
    },
    get_all: {
        id: 4,
        messages: {
            en: "Success!",
            ru: "Успешно!",
            uz: "Muvaffaqiyatli!",
        },
    },
    get_one: {
        id: 5,
        messages: {
            en: "Success!",
            ru: "Успешно!",
            uz: "Muvaffaqiyatli!",
        },
    },
    not_found: {
        id: 6,
        messages: {
            en: "Not found!",
            ru: "Не найдено!",
            uz: "Topilmadi!",
        },
    },
    unauthorized: {
        id: 7,
        messages: {
            en: "Unauthorized action!",
            ru: "Несанкционированное действие!",
            uz: "Ruxsat etilmagan harakat!",
        },
    },
    bad_request: {
        id: 8,
        messages: {
            en: "Invalid request!",
            ru: "Неверный запрос!",
            uz: "Noto'g'ri so'rov!",
        },
    },
    added_to_basket: {
        id: 9,
        messages: {
            en: "Added to basket!",
            ru: "Добавлено в корзину!",
            uz: "Savatga qo'shildi!",
        },
    },
    remove_from_basket: {
        id: 10,
        messages: {
            en: "Removed from basket!",
            ru: "Удалено из корзины!",
            uz: "Savatdan o'chirildi!",
        },
    },
    clear_basket: {
        id: 11,
        messages: {
            en: "Basket cleared!",
            ru: "Корзина очищена!",
            uz: "Savat tozalandi!",
        },
    },
    order_placed: {
        id: 12,
        messages: {
            en: "Order placed successfully!",
            ru: "Заказ успешно оформлен!",
            uz: "Buyurtma muvaffaqiyatli bajarildi!",
        },
    },
    order_cancelled: {
        id: 13,
        messages: {
            en: "Order cancelled!",
            ru: "Заказ отменен!",
            uz: "Buyurtma bekor qilindi!",
        },
    },
    order_not_found: {
        id: 14,
        messages: {
            en: "Order not found!",
            ru: "Заказ не найден!",
            uz: "Buyurtma topilmadi!",
        },
    },
    product_not_found: {
        id: 15,
        messages: {
            en: "Product not found!",
            ru: "Товар не найден!",
            uz: "Mahsulot topilmadi!",
        },
    },
    forbidden: {
        id: 16,
        messages: {
            en: "You don't have permission to perform this action!",
            ru: "У вас нет разрешения на выполнение этого действия!",
            uz: "Bu amalni bajarish uchun ruxsatingiz yo'q!",
        },
    },
    already_exists: {
        id: 17,
        messages: {
            en: "User already exists!",
            ru: "Пользователь уже существует!",
            uz: "Foydalanuvchi allaqachon mavjud!",
        },
    },
    no_data: {
        id: 18,
        messages: {
            en: "No data provided for update!",
            ru: "Данные для обновления не предоставлены!",
            uz: "Yangilash uchun hech qanday ma'lumot berilmagan!",
        },
    },
    parent_not_found: {
        id: 19,
        messages: {
            en: "Parent category not found!",
            ru: "Родительская категория не найдена!",
            uz: "Ota kategoriya topilmadi!",
        },
    },
    category_not_found: {
        id: 20,
        messages: {
            en: "Category not found!",
            ru: "Категория не найдена!",
            uz: "Kategoriya topilmadi!",
        },
    },
    basket_item_not_found: {
        id: 21,
        messages: {
            en: "Basket item not found!",
            ru: "Элемент корзины не найден!",
            uz: "Savat elementi topilmadi!",
        },
    },
    get_deleted: {
        id: 22,
        messages: {
            en: "Deleted items fetched successfully!",
            ru: "Удаленные элементы успешно получены!",
            uz: "O'chirilgan elementlar muvaffaqiyatli olindi!",
        },
    },

};

export function responseByLang(
    method: keyof IResponseMap,
    lang: keyof (typeof RESPONSE_PROMPTS)[keyof IResponseMap]["messages"],
    replacements?: Record<string, string> // <-- Dinamik qiymatlar uchun
): string {
    let message = RESPONSE_PROMPTS[method]?.messages[lang] || "Message not found for the given language.";

    // Agar replacements mavjud bo'lsa, matn ichidagi `{}` joylarini almashtiramiz
    if (replacements) {
        for (const key in replacements) {
            message = message.replace(`{${key}}`, replacements[key]);
        }
    }

    return message;
}
