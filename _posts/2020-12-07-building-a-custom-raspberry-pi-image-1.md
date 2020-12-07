---
layout: post
title: "Building a custom raspberry pi image - part 1"
date: 2020-12-07 04:29:48 AM 
categories:
---

This was motivated by listening to Jay Carlson's [Amp Hour podcast](https://theamphour.com/515-embedded-linux-with-jay-carlson/) and reading his blog post ["So You Want to Build an Embedded Linux System?"](https://jaycarlson.net/embedded-linux/). The following was done on a raspberry pi 3B.

The build system used is Buildroot. The only other alternative looked into was [Yocto](https://docs.yoctoproject.org/) but a cursory investigation seemed to indicate that people found Buildroot easier to start up with.
Having used Buildroot a little for this project, the process does seem rather straightforward. Your final file image is entirely configured by a single `.config` file and adding packages is done by adding new directories, following certain conventions to relevant subdirectories (whether that be `package`, `fs`, `toolchain` or so on).

The first goal was to build and flash something working:

    $ git clone git@github.com:buildroot/buildroot.git
    $ cd buildroot
    $ make raspberrypi3_qt5we_defconfig
    $ make
    $ dd bs=5M if=output/images/sdcard.img of=/dev/sdX conv=fsync

The third line `make raspberrypi3_qt5we_defconfig` creates the `.config` file in the project root, being a copy of a [predefined raspberry pi3 config with support for QT, defined in the master tree](https://github.com/buildroot/buildroot/blob/a418d0ac51e192adc54300f16b46b12a42b2b117/configs/raspberrypi3_qt5we_defconfig). This is pretty nice as it's something in the mainline that is guaranteed to work for the board. 

If you followed that link, the `.config` syntax is pretty manageable, it's a key-value format and describes things such as architecture, which SoC, root filesystem etc. This is merged with some default config file, I think, to fill in all the gaps.

    $ wc -l .config
    3416 .config
    $ head -10 .config
    #
    # Automatically generated file; DO NOT EDIT.
    # Buildroot 2020.11-rc3-dirty Configuration
    #
    BR2_HAVE_DOT_CONFIG=y
    BR2_HOST_GCC_AT_LEAST_4_9=y
    BR2_HOST_GCC_AT_LEAST_5=y
    BR2_HOST_GCC_AT_LEAST_6=y
    BR2_HOST_GCC_AT_LEAST_7=y
    BR2_HOST_GCC_AT_LEAST_8=y

From there, `make` is called to build the image and a bunch of files/directories are generated in `output/`. The fit-for-consumption product is located at `output/images/sdcard.img` which can be copied onto a FAT32 formatted sd card.

Running that, the Pi boots up into a bare bones tty. It works, hooray,

    ...
    Welcome to Buildroot
    buildroot login: root
    Password: 
    # pwd
    /root
    # ls /
    bin dev etc lib lib32 linuxrc lost+found media mnt opt proc root run sbin sys tmp usr var

### Adding a custom binary to the image

To add a binary to the final image, I started with a simple executable:

    #include <stdio.h>
    #include <stdlib.h>

    int main(void)
    {
           printf("Goobily doo\n");
           return 0;
    }

As mentioned above, as far as I can tell, there are two main steps: 1) creating the package and 2) enabling the package. The package creation has helper tools for different types of builds: `cmake-package`, `python-package`, `luarocks-package` and so on, which are all extensions (I think) of a `generic-package` macro. There doesn't seem to be a process for just compiling a single C file but it's simple to hook into the build command with something like this:

    define PI_MAIN_CONTROLLER_BUILD_CMDS
       $(TARGET_CC) -o $(@D)/pi-main-controller $(@D)/main.c
    endef

`$(TARGET_CC)` and `$(@D)` are special variables defined by Buildroot, representing the cross compiler and the build directory respectively. Very neat. About the build directory, before this `<package_name>_BUILD_CMDS` is run, an earlier step copies everything in `package/<package_name>/` to `output/build/<package_name>-<version>/`.

There's another hook for after the build process to install to the target. Since this is an executable, the following sets the binary as executable and moves it to `output/target/usr/bin/pi-main-controller`. 

    define PI_MAIN_CONTROLLER_INSTALL_TARGET_CMDS
       $(INSTALL) -D -m 0755 $(@D)/pi-main-controller $(TARGET_DIR)/usr/bin/pi-main-controller
    endef

Running `make` again to rebuild:

    $ make 

If it worked correctly:

    $ ls output/target/usr/bin/pi-main-controller
    output/target/usr/bin/pi-main-controller

From there, flashing the new image onto the sd card with that same `dd` command:

    $ dd bs=5M if=output/images/sdcard.img of=/dev/sdX conv=fsync

...then plugging that in and logging in:

    ...
    Welcome to Buildroot
    buildroot login: root
    Password: 
    # pwd
    /root
    # pi-main-controller
    Goobily doo
    # 

There's some working code implementing the above in this commit [e24ddae](https://github.com/eltonlaw/pi-main-controller/commit/e24ddae64226c6dae5bd0ff7cda682444888c392). Before reading it though, some notes:

- The `.py` files can be ignored as they're just helper scripts based on the way I structured the directory.
- For a clean separation, `buildroot` is a git submodule and the root `Makefile`'s `build` target copies all custom code and configurations from a `src` directory to their appropriate locatons.
- The directory is structured like it is to make it simpler pulling in new commits from mainline and to easier tell what's being customized/replaced.

### Adding QT support

I found a basic hello world QT application [here](https://bootlin.com/blog/building-a-linux-system-for-the-stm32mp1-setting-up-a-qt5-application-development-environment/) 

    #include <QApplication>
    #include <QPushButton>

    int main(int argc, char* argv[])
    {
        QApplication app(argc, argv);
        QPushButton hello("Hello world!");
        hello.resize(100,30);
        hello.show();
        return app.exec();
    }

and to modify Buildroot's cross compilation toolchain to compile this, some settings need to be set. Unfortunately, I'm not familliar with it and have no clue what settings need to be set, leaving whatever `make raspberrypi3_qt5we_defconfig` created:

    BR2_PACKAGE_QT5_GL_AVAILABLE=y
    BR2_PACKAGE_QT5_JSCORE_AVAILABLE=y
    BR2_PACKAGE_QT5=y
    BR2_PACKAGE_QT5BASE=y
    BR2_PACKAGE_QT5BASE_CUSTOM_CONF_OPTS=""
    BR2_PACKAGE_QT5BASE_CONFIG_FILE=""
    BR2_PACKAGE_QT5BASE_EXAMPLES=y
    BR2_PACKAGE_QT5BASE_NETWORK=y
    BR2_PACKAGE_QT5BASE_SQL=y
    BR2_PACKAGE_QT5BASE_SQLITE_NONE=y
    BR2_PACKAGE_QT5BASE_TEST=y
    BR2_PACKAGE_QT5BASE_XML=y
    BR2_PACKAGE_QT5BASE_GUI=y
    BR2_PACKAGE_QT5BASE_WIDGETS=y
    BR2_PACKAGE_QT5BASE_OPENGL=y
    BR2_PACKAGE_QT5BASE_OPENGL_ES2=y

    BR2_PACKAGE_QT5BASE_EGLFS=y
    BR2_PACKAGE_QT5BASE_DEFAULT_QPA=""
    BR2_PACKAGE_QT5BASE_PRINTSUPPORT=y
    BR2_PACKAGE_QT5BASE_FONTCONFIG=y
    BR2_PACKAGE_QT5BASE_GIF=y
    BR2_PACKAGE_QT5BASE_JPEG=y
    BR2_PACKAGE_QT5BASE_PNG=y
    BR2_PACKAGE_QT5BASE_DBUS=y
    BR2_PACKAGE_QT5BASE_ICU=y

    BR2_PACKAGE_QT5DECLARATIVE=y
    BR2_PACKAGE_QT5DECLARATIVE_QUICK=y
    BR2_PACKAGE_QT5QUICKCONTROLS=y
    BR2_PACKAGE_QT5QUICKCONTROLS2=y
    BR2_PACKAGE_QT5SVG=y
    BR2_PACKAGE_QT5WEBCHANNEL=y
    BR2_PACKAGE_QT5WEBENGINE_ARCH_SUPPORTS=y
    BR2_PACKAGE_QT5WEBENGINE=y
    BR2_PACKAGE_QT5WEBENGINE_PROPRIETARY_CODECS=y
    BR2_PACKAGE_QT5WEBSOCKETS=y

Apparently the build process for a QT application is involved, I see alot of apps using `qmake` or `cmake`. Here's the full change swapping from a single C file app to using cmake [2b1df29](https://github.com/eltonlaw/pi-main-controller/commit/2b1df298ae86ee18422f0785ae59c72688ae1768). Swapping to `cmake` is easy. `CMakeLists.txt` is put into `packages/pi-main-controller` which will get unpacked into `$(@D)` like every other `cmake-packages` project in the mainline. The  `*_BUILD_CMDS` function is predefined so that can be removed. Last, `generic-package` is replaced with `cmake-package`. Flash it with `dd` and done. Running `pi-main-controller` opens up `Hello World!` in the center with a white background.
