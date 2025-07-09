import json
import os
import platform
import shutil
import subprocess
import zipfile
import sys
from tkinter import Tk, Label, PhotoImage


KEY: bytes = "rJ2U@jYpN#c*6Wf!lG8$7iPZtKvXoAn3qH*9Mz0sD#FgE4uVyTb1wCmXoJgDq1R".encode(
    "utf-8"
)

file_install = "C:/OfficeLTSC/"


with open("config.json", "r") as file:
    DATA = json.load(file)


def center_window(win: Tk, wd: int, hg: int):
    x = (win.winfo_screenwidth() - wd) // 2
    y = (win.winfo_screenheight() - hg) // 2
    win.geometry(f"{wd}x{hg}+{x}+{y}")


def remove_files():
    if os.path.exists(file_install):
        shutil.rmtree(file_install)
        return True

    return True


def remove_installation():
    remove_files()
    sys.exit()


def create_new_file_install():
    remove_files()
    os.mkdir(file_install)
    with zipfile.ZipFile("tools.zip", "r") as zip_extract:
        zip_extract.extractall(path=file_install, pwd=KEY)
        return True


def install():
    create_new_file_install()
    r = file_install + platform.architecture()[0]
    command = f'"{
        r}/setup" /configure "{r}/config{platform.architecture()[0]}s.xml"'
    subprocess.run(command, shell=False)
    subprocess.run(
        f"{r}/activate{platform.architecture()[0]}.cmd",
        shell=True,
    )
    Finish()


class Finish:

    def __init__(self):

        # configure window for use in display the user
        window = Tk()
        window.withdraw()
        window.overrideredirect(True)
        center_window(window, 652, 452)
        window.attributes("-topmost", True)

        # border
        border_win = Label(window, bg="#cccccc")
        border_win.place(width=652, height=452)

        # background
        background_win = Label(window, bg="white")
        background_win.place(width=650, height=450, x=1, y=1)

        # config information
        name = Label(window, text=DATA["name"], font=("Arial", 25), bg="white")
        name.place(x=20, y=30)

        publisher_img = PhotoImage(file="resources/publisher.png")
        publisher = Label(
            window,
            text=f" Publisher - {DATA['publisher']}",
            font=("Arial", 11),
            bg="white",
            image=publisher_img,
            compound="left",
        )
        publisher.place(x=20, y=100)

        version_img = PhotoImage(file="resources/version.png")
        version = Label(
            window,
            text=f" Version - {DATA['version']}",
            font=("Arial", 11),
            bg="white",
            image=version_img,
            compound="left",
        )
        version.place(x=20, y=132)

        # image the logo
        logo_img = PhotoImage(file="resources/logo.png")
        logo = Label(window, image=logo_img, borderwidth=0, bg="white")
        logo.place(x=500, y=30)

        # buttons actions
        button_finish = Label(
            window,
            text="Finish",
            font=("Arial", 12),
            bg="#eb3b00",
            fg="white",
            borderwidth=0,
            cursor="hand2",
        )
        button_finish.place(width=130, height=40, x=500, y=390)
        button_finish.bind(
            "<ButtonPress-1>", lambda event: (window.destroy(), remove_installation())
        )

        # view window
        window.deiconify()
        window.mainloop()


class Main:

    def __init__(self):

        # configure window for use in display the user
        window = Tk()
        window.withdraw()
        window.overrideredirect(True)
        center_window(window, 652, 452)
        window.attributes("-topmost", True)

        # border
        border_win = Label(window, bg="#cccccc")
        border_win.place(width=652, height=452)

        # background
        background_win = Label(window, bg="white")
        background_win.place(width=650, height=450, x=1, y=1)

        # config information
        name = Label(window, text=DATA["name"], font=("Arial", 25), bg="white")
        name.place(x=20, y=30)

        publisher_img = PhotoImage(file="resources/publisher.png")
        publisher = Label(
            window,
            text=f" Publisher - {DATA['publisher']}",
            font=("Arial", 11),
            bg="white",
            image=publisher_img,
            compound="left",
        )
        publisher.place(x=20, y=100)

        version_img = PhotoImage(file="resources/version.png")
        version = Label(
            window,
            text=f" Version - {DATA['version']}",
            font=("Arial", 11),
            bg="white",
            image=version_img,
            compound="left",
        )
        version.place(x=20, y=132)

        # image the logo
        logo_img = PhotoImage(file="resources/logo.png")
        logo = Label(window, image=logo_img, borderwidth=0, bg="white")
        logo.place(x=500, y=30)

        # buttons actions
        button_cancel = Label(
            window,
            text="Cancel",
            font=("Arial", 12),
            bg="#e4e4e4",
            fg="black",
            borderwidth=0,
            cursor="hand2",
        )
        button_cancel.place(width=130, height=40, x=350, y=390)
        button_cancel.bind(
            "<ButtonPress-1>", lambda event: [window.destroy(), sys.exit()]
        )

        button_install = Label(
            window,
            text="Install",
            font=("Arial", 12),
            bg="#eb3b00",
            fg="white",
            borderwidth=0,
            cursor="hand2",
        )
        button_install.place(width=130, height=40, x=500, y=390)
        button_install.bind(
            "<ButtonPress-1>", lambda event: (window.destroy(), install())
        )

        # view window
        window.deiconify()
        window.mainloop()


if __name__ == "__main__":

    Main()
