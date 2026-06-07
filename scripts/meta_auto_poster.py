import argparse
import asyncio
import json
import sys
from datetime import datetime, timedelta
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
IMAGE_ROOT = PROJECT_ROOT / "content" / "images" / "TravelSlydeShow"
USER_DATA_DIR = PROJECT_ROOT / ".meta-user-data"
SCHEDULE_STATE_FILE = PROJECT_ROOT / ".meta-post-schedule.json"
INTERVAL_DAYS = 3
POST_INTERVAL_DAYS = [4, 4, 3, 3, 3, 3]
FACEBOOK_PAGE_ID = "61579990136292"
FACEBOOK_PAGE_URL = f"https://www.facebook.com/profile.php?id={FACEBOOK_PAGE_ID}"
INSTAGRAM_USERNAME = "holymovela"
INSTAGRAM_URL = f"https://www.instagram.com/{INSTAGRAM_USERNAME}/"
META_COMPOSER_URL = f"https://business.facebook.com/latest/composer?asset_id={FACEBOOK_PAGE_ID}"

COMMON_HASHTAGS = (
    "#HolyMove #LosAngelesMoving #LAMoving #MovingToLA #CaliforniaMoving "
    "#MovingHelp #MovingServices #Relocation #RelocationServices #FamilyMove "
    "#MovingDay #NewHome #LosAngeles #California #USA #SouthernCalifornia "
    "#MoveWithConfidence"
)

POSTS = [
    {
        "title": "Новая глава",
        "image": IMAGE_ROOT / "6" / "6 (3).png",
        "caption": """Переезд — это не просто смена адреса. Это момент, когда вы закрываете одну книгу и открываете абсолютно чистую страницу. Страх перед неизвестным — это нормально. Но помните: самые красивые истории начинаются с одного решительного шага. Мы здесь, чтобы этот шаг был легким.

✨ Holy Move
Мы переносим не вещи, мы переносим вашу жизнь.

#HolyMove #NewChapter #LAMoving #MovingDay""",
    },
    {
        "title": "Детали важны",
        "image": IMAGE_ROOT / "5" / "ChatGPT Image 27 мая 2026 г., 19_18_02.png",
        "caption": """Ваша любимая кружка, которая пережила три переезда. Книги, которые вы перечитывали сотни раз. Старая гитара, ждущая своего часа. Для кого-то это просто «груз», для нас — это ваши сокровища. Мы упаковываем каждый предмет так, будто он принадлежит нашей семье.

✨ Holy Move
Доверие в каждой коробке.

#HolyMove #PackingTips #CarefulMoving #CaliforniaLiving""",
    },
    {
        "title": "Без стресса",
        "image": IMAGE_ROOT / "8" / "8.png",
        "caption": """Говорят, что переезд по уровню стресса равен двум пожарам. Мы не согласны. Переезд может быть временем предвкушения и радости, если вы делегируете тяжелую работу профессионалам. Пока вы планируете, где поставить диван в новом доме, мы берем на себя всё остальное.

✨ Holy Move
Ваш спокойный переезд — наша главная миссия.

#HolyMove #StressFreeMoving #LosAngeles #MovingServices""",
    },
    {
        "title": "Дом там, где сердце",
        "image": IMAGE_ROOT / "9" / "9 (6).png",
        "caption": """Вы можете сменить город, штат или даже континент. Но дом — это не стены. Это смех ваших детей, запах утреннего кофе и чувство безопасности. Мы помогаем вам воссоздать это чувство на новом месте в рекордно короткие сроки.

✨ Holy Move
Создаем уют вместе с вами.

#HolyMove #HomeSweetHome #Relocation #MovingToCalifornia""",
    },
    {
        "title": "Команда мечты",
        "image": IMAGE_ROOT / "10" / "ChatGPT Image 27 мая 2026 г., 20_15_47.png",
        "caption": """За каждым успешным переездом стоят люди. Крепкие руки, спокойные улыбки и многолетний опыт. Наша команда — это не просто грузчики. Это ваши союзники в один из самых важных дней вашей жизни.

✨ Holy Move
Люди, которым можно доверять.

#HolyMove #TeamWork #BestMovers #MovingHelp""",
    },
    {
        "title": "Первая ночь на новом месте",
        "image": IMAGE_ROOT / "7" / "7 (2).png",
        "caption": """Тот самый момент: коробки еще не разобраны, но вы уже заварили чай и смотрите в окно на новый город. Это тишина перед великими свершениями. Наслаждайтесь моментом, а тяжелую работу мы уже сделали за вас.

✨ Holy Move
Ваш новый старт начинается здесь.

#HolyMove #NewBeginnings #FirstNight #LAMover""",
    },
    {
        "title": "Почему мы?",
        "image": IMAGE_ROOT / "4" / "4 (2).png",
        "caption": """Выбирая мувинговую компанию, вы выбираете спокойствие. Holy Move — это прозрачные цены, бережное отношение и пунктуальность. Мы ценим ваше время и ваши воспоминания.

✨ Holy Move
Качество, проверенное временем.

#HolyMove #MovingTips #ReliableMovers #SouthernCalifornia""",
    },
]


def parse_args():
    parser = argparse.ArgumentParser(description="Publish one Holy Move post through Meta Business Suite.")
    parser.add_argument("--post", type=int, choices=range(1, len(POSTS) + 1), help="Post number, from 1 to 7.")
    parser.add_argument("--publish", action="store_true", help="Actually click the Publish button.")
    parser.add_argument("--login", action="store_true", help="Open Meta Business Suite only, to log in.")
    parser.add_argument("--list", action="store_true", help="List configured posts.")
    parser.add_argument("--init-schedule", action="store_true", help="Start a schedule whose first post is due in 3 days.")
    parser.add_argument("--run-due", action="store_true", help="Publish the next post only when its scheduled time is due.")
    parser.add_argument("--status", action="store_true", help="Show schedule status.")
    return parser.parse_args()


def validate_posts():
    missing = [str(post["image"]) for post in POSTS if not post["image"].is_file()]
    if missing:
        raise FileNotFoundError("Missing image files:\n" + "\n".join(missing))


def print_posts():
    for number, post in enumerate(POSTS, start=1):
        print(f"{number}: {post['title']} -> {post['image'].relative_to(PROJECT_ROOT)}")


def load_schedule():
    if not SCHEDULE_STATE_FILE.is_file():
        return None
    return json.loads(SCHEDULE_STATE_FILE.read_text(encoding="utf-8"))


def save_schedule(schedule):
    SCHEDULE_STATE_FILE.write_text(
        json.dumps(schedule, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def init_schedule():
    first_due = datetime.now().astimezone() + timedelta(days=INTERVAL_DAYS)
    schedule = {
        "next_post_index": 0,
        "next_due": first_due.isoformat(timespec="seconds"),
        "interval_days": INTERVAL_DAYS,
        "completed": False,
    }
    save_schedule(schedule)
    print(f"Расписание создано. Первый пост: {first_due:%d.%m.%Y %H:%M %Z}")
    print_schedule(schedule)


def print_schedule(schedule=None):
    schedule = schedule or load_schedule()
    if not schedule:
        print("Расписание еще не создано.")
        return
    if schedule["completed"]:
        print("Все 7 постов опубликованы.")
        return

    print(f"Facebook: {FACEBOOK_PAGE_URL}")
    print(f"Instagram: {INSTAGRAM_URL}")
    next_index = schedule["next_post_index"]
    next_due = datetime.fromisoformat(schedule["next_due"])
    print(f"Следующий пост: {next_index + 1} — {POSTS[next_index]['title']}")
    print(f"Срок публикации: {next_due:%d.%m.%Y %H:%M %Z}")
    print("Последующие публикации:")
    due = next_due
    for index in range(next_index, len(POSTS)):
        print(f"  {index + 1}: {due:%d.%m.%Y %H:%M} — {POSTS[index]['title']}")
        if index < len(POSTS) - 1:
            due += timedelta(days=POST_INTERVAL_DAYS[index])


def load_playwright():
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        raise SystemExit(
            "Playwright не установлен. Выполните:\n"
            "python -m pip install playwright\n"
            "python -m playwright install chromium"
        )
    return async_playwright


async def open_meta(post, publish):
    async_playwright = load_playwright()

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch_persistent_context(
            str(USER_DATA_DIR),
            headless=False,
            slow_mo=500,
        )
        page = browser.pages[0] if browser.pages else await browser.new_page()
        await page.goto(META_COMPOSER_URL)

        if "login" in page.url.lower():
            print("Войдите в Meta Business Suite в открытом окне, затем запустите команду снова.")
            await page.wait_for_timeout(120_000)
            await browser.close()
            return False

        await page.wait_for_timeout(5_000)
        page_text = (await page.locator("body").inner_text()).lower()
        if INSTAGRAM_USERNAME not in page_text:
            print(
                f"Instagram @{INSTAGRAM_USERNAME} не найден в Meta Composer. "
                "Публикация остановлена: подключите или выберите этот Instagram-аккаунт."
            )
            await page.wait_for_timeout(120_000)
            await browser.close()
            return False

        file_input = page.locator('input[type="file"]').first
        await file_input.wait_for(state="attached", timeout=30_000)
        await file_input.set_input_files(str(post["image"]))

        textbox = page.locator('div[role="textbox"]').first
        await textbox.wait_for(state="visible", timeout=30_000)
        await textbox.fill(f"{post['caption']}\n\n{COMMON_HASHTAGS}")

        if publish:
            publish_button = page.get_by_role("button", name="Publish", exact=True)
            await publish_button.wait_for(state="visible", timeout=30_000)
            await publish_button.click()
            print(f"Пост опубликован: {post['title']}")
            await page.wait_for_timeout(10_000)
            result = True
        else:
            print("Черновик заполнен. Проверьте его в браузере; кнопка Publish не нажата.")
            await page.wait_for_timeout(300_000)
            result = False

        await browser.close()
        return result


async def publish_due_post():
    schedule = load_schedule()
    if not schedule:
        print("Расписание отсутствует. Сначала выполните --init-schedule.")
        return
    if schedule["completed"]:
        print("Все посты уже опубликованы.")
        return

    due = datetime.fromisoformat(schedule["next_due"])
    now = datetime.now().astimezone()
    if now < due:
        print(f"Еще не время. Следующая публикация: {due:%d.%m.%Y %H:%M %Z}")
        return

    index = schedule["next_post_index"]
    post = POSTS[index]
    print(f"Публикуется пост {index + 1}: {post['title']}")
    if not await open_meta(post, publish=True):
        print("Публикация не подтверждена. Состояние расписания не изменено.")
        return

    next_index = index + 1
    if next_index >= len(POSTS):
        schedule["completed"] = True
    else:
        schedule["next_post_index"] = next_index
        schedule["next_due"] = (
            datetime.now().astimezone() + timedelta(days=POST_INTERVAL_DAYS[index])
        ).isoformat(timespec="seconds")
    save_schedule(schedule)
    print_schedule(schedule)


async def login_only():
    async_playwright = load_playwright()

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch_persistent_context(
            str(USER_DATA_DIR),
            headless=False,
        )
        page = browser.pages[0] if browser.pages else await browser.new_page()
        await page.goto(META_COMPOSER_URL)
        print(
            f"Войдите в Meta Business Suite и выберите Facebook Page {FACEBOOK_PAGE_ID} "
            f"и Instagram @{INSTAGRAM_USERNAME}. Окно останется открытым 5 минут."
        )
        await page.wait_for_timeout(300_000)
        await browser.close()


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    args = parse_args()
    validate_posts()

    if args.list:
        print_posts()
        return
    if args.init_schedule:
        init_schedule()
        return
    if args.status:
        print_schedule()
        return
    if args.run_due:
        if not args.publish:
            raise SystemExit("--run-due требует явный флаг --publish")
        asyncio.run(publish_due_post())
        return
    if args.login:
        asyncio.run(login_only())
        return
    if args.post is None:
        print_posts()
        print("\nДля подготовки поста: python scripts/meta_auto_poster.py --post 1")
        print("Для публикации: python scripts/meta_auto_poster.py --post 1 --publish")
        return

    post = POSTS[args.post - 1]
    print(f"Выбран пост {args.post}: {post['title']}")
    asyncio.run(open_meta(post, args.publish))


if __name__ == "__main__":
    main()
