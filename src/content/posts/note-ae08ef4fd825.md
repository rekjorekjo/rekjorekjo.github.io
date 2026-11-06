---
title: Qt 窗口部件
description: 1 基础窗口部件QWidget QWidget类是所有用户界面对象的基类，即基础窗口部件。 QWidget 继承自 QObject 和
  QPaintDevice。 QObject 提供 Qt 对象模型、信号槽、父子对象等机制； QPaintDevice 表示该对象可以作为绘图设备
date: 2026-05-27T11:58:05.000Z
categories:
  - Qt
tags: []
minutes: 21
demo: false
draft: false
---



## 1 基础窗口部件QWidget

> QWidget类是所有用户界面对象的基类，即基础窗口部件。
>
> QWidget 继承自 `QObject` 和 `QPaintDevice`。
> QObject 提供 Qt 对象模型、信号槽、父子对象等机制；
> QPaintDevice 表示该对象可以作为绘图设备，被 QPainter 绘制。

### 1.1 窗口与子部件

+ **窗口**是没有父部件的部件，即`顶级部件（top-level widget）`。
+ **非窗口部件**称为`子部件（child widget）`。

在构造函数里面，

+ 如果传入 `父部件 parent widget`，通常成为该 parent 内部的子部件；
+ 如果没有 parent，通常成为顶级窗口。

例如:

```c++
QLabel *label = new QLabel(this);
```

这里this=parent，于是QLabel对象会变成this窗口里面的一个子控件。

```c++
QLabel *label = new QLabel;
label->show();
```

这里QLabel对象没有父对象，于是它自己就是一个独立窗口。

### 1.2 窗口类型

窗口一般都有边框和标题栏。QWidget的构造函数有两个形参:

```c++
QWidget(QWidget *parent = nullptr, Qt::WindowFlags f = Qt::WindowFlags());
```

参数 `f` 是 `Qt::WindowFlags` 类型，是 `Qt::WindowType` 枚举值的按位或组合。

注意是按位或，而不是逻辑或，举例（仅示例，非真实值）:

```c++
Qt::Dialog                0001
Qt::FramelessWindowHint   0010
Qt::WindowStaysOnTopHint  0100
```

那么`Qt::Dialog | Qt::FramelessWindowHint`就变成**0011**，表示两个属性都打开。

```c++
// =========================
// 常用 Qt::WindowType / WindowFlags
// =========================
// ---------- 窗口类型 ----------
Qt::Window                 // 普通独立窗口
Qt::Dialog                 // 对话框
Qt::Tool                   // 工具窗口
Qt::Popup                  // 弹出窗口
Qt::ToolTip                // 工具提示窗口，手动使用较少
Qt::SplashScreen           // 启动画面
Qt::Widget                 // 普通子控件（默认）
// ---------- 窗口外观 / 行为 ----------
Qt::FramelessWindowHint    // 无边框
Qt::WindowStaysOnTopHint   // 永远置顶
Qt::CustomizeWindowHint    // 自定义标题栏
Qt::WindowMinimizeButtonHint // 最小化按钮
Qt::WindowMaximizeButtonHint // 最大化按钮
Qt::WindowCloseButtonHint  // 关闭按钮
```

### 1.3 窗口几何

```c++
// =========================
// Qt 窗口几何/位置常用函数（QWidget 成员函数）
// =========================
// ---------- 窗口位置 ----------
int x() const;                             // 左上角 x 坐标（包含边框）
int y() const;                             // 左上角 y 坐标（包含边框）
QPoint pos() const;                        // 左上角坐标
void move(int x, int y);                   // 移动窗口
// ---------- 内容区大小 ----------
int width() const;                         // 内容区宽度
int height() const;                        // 内容区高度
QSize size() const;                        // 内容区大小
QRect rect() const;                        // 内容区矩形
QRect geometry() const;                    // 内容区几何信息
// ---------- 整个窗口外框 ----------
QRect frameGeometry() const;               // 整个窗口几何（包含标题栏/边框）
// ---------- 修改大小 ----------
void resize(int w, int h);                 // 设置内容区大小
void setGeometry(int x, int y, int w, int h); // 同时设置位置和大小
// ---------- 常见 QWidget 相关 ----------
void show();                               // 显示窗口
void hide();                               // 隐藏窗口
bool close();                              // 关闭窗口
void setWindowTitle(const QString &title); // 设置窗口标题
void setWindowIcon(const QIcon &icon);     // 设置窗口图标
void setWindowFlags(Qt::WindowFlags type); // 设置窗口 flags
// ---------- Widget 属性 ----------
void setAttribute(Qt::WidgetAttribute attribute, bool on = true); // 设置 Widget 属性
```

## 2 对话框QDialog

### 2.1 模态和非模态对话框

+ 模态对话框 `modal dialog`：没有关闭之前，不能与同一个应用程序的其他窗口进行交互。

+ 非模态对话框 `modeless dialog`：可以与它交互，也可以与同一程序中的其他窗口交互。

常见写法:

```c++
//modal dialog
QDialog dialog;
dialog.exec();
```

`exec()` 会打开模态事件循环。

```c++
//modeless dialog
QDialog *dlg = new QDialog(this);
dlg->show();
```

> Q: modeless dialog必须new吗？
> A: 不一定必须 new，但非模态对话框经常需要 new。
> 原因:
> 如果你写局部变量：
>
> ```c++
> void MainWindow::openDialog()
> {
>  QDialog dlg(this);
>  dlg.show();
> }
> ```
>
> 问题是：函数一结束，dlg 就被销毁了，所以窗口可能一闪而过。
>
> 所以非模态常写成：
>
> ```c++
> void MainWindow::openDialog()
> {
>  QDialog *dlg = new QDialog(this);
>  dlg->show();
> }
> ```
>
> 这样函数结束后，对话框还活着。

+ 有一种特殊形式:
  用 `setModal(true)` 建立 modal dialog。
  例如:

```c++
void MainWindow::onSaveClicked() {
    QDialog *dlg = new QDialog(this);
    dlg->setWindowTitle("正在保存...");
    dlg->setModal(true);
    dlg->setAttribute(Qt::WA_DeleteOnClose);
    dlg->show();
    QTimer::singleShot(3000, dlg, [dlg]() { dlg->close(); }); // 3 秒后关闭，主窗口恢复可操作
}
```

> 对比一下:
>
> exec()
> = 同步（阻塞）
>
> show() + setModal(true)
> = 更接近异步

+ 补充介绍:setWindowModality()
  作用是设置“模态范围”：

```c++
void QWidget::setWindowModality(Qt::WindowModality windowModality);
```

常见枚举值：

```c++
Qt::NonModal          // 非模态
Qt::WindowModal       // 阻塞所属窗口链，通常包括父窗口及祖先窗口
Qt::ApplicationModal  // 阻塞整个应用程序的所有窗口
```

### 2.2 标准对话框

#### 2.2.1 QMessageBox

这是消息对话框。
使用时加`#include <QMessageBox>`
例如:
提示

```c++
QMessageBox::information(this, "提示", "保存成功");
```

警告

```c++
QMessageBox::warning(this, "警告", "文件不存在");
```

错误

```c++
QMessageBox::critical(this, "错误", "程序崩溃");
```

询问

```c++
QMessageBox::question(this, "确认", "确定删除吗？");
```

#### 2.2.2 QFileDialog

这是文件对话框。
使用时加`#include <QFileDialog>`

+ 用于：
  打开文件
  保存文件
  选择文件夹

打开文件

```c++
QString fileName = QFileDialog::getOpenFileName(this, "选择文件", "", "Images (*.png *.jpg)");
```

保存文件

```c++
QString fileName = QFileDialog::getSaveFileName(this, "保存文件");
```

选择目录

```c++
QString dir = QFileDialog::getExistingDirectory(this, "选择目录");
```

#### 2.2.3 QColorDialog

这是颜色对话框。
使用时加`#include <QColorDialog>`

```c++
QColor color = QColorDialog::getColor(Qt::white, this);
```

#### 2.2.4 QFontDialog

这是字体对话框。
使用时加`#include <QFontDialog>`

用于：

选择字体
字号
粗体

```c++
bool ok;

QFont font = QFontDialog::getFont(&ok, this);
```

#### 2.2.5 QInputDialog

这是输入对话框。
使用时加`#include <QInputDialog>`

输入文本

```c++
QString text = QInputDialog::getText(this, "输入", "请输入名字：");
```

输入整数

```c++
int value = QInputDialog::getInt(this, "输入", "请输入数字：");
```

输入浮点数

```c++
double value = QInputDialog::getDouble(this, "输入", "请输入数值：");
```

#### 2.2.6 QProgressDialog

这是进度对话框。
使用时加`#include <QProgressDialog>`

用于：

下载进度
加载资源
长时间任务

```c++
QProgressDialog dlg("正在下载...", "取消", 0, 100, this);
dlg.setValue(50);
```

## 3 QFrame类

QFrame类是带有边框的部件的基类。子类例如:QLabel，QAbstractScrollArea，等等。

+ Qt 中名称带有 Abstract 的类通常表示抽象基类，一般不直接实例化，主要用于提供公共接口。

+ 最核心的两个概念

1. FrameShape（边框形状）

```c++
setFrameShape(...)
```

常见值：

```c++
QFrame::NoFrame      // 无边框
QFrame::Box          // 方框
QFrame::Panel        // 面板
QFrame::StyledPanel  // 样式面板，通常取决于程序运行的系统，Windows/Mac OS/Linux KDE...
QFrame::HLine        // 横线
QFrame::VLine        // 竖线
```

2. FrameShadow（阴影效果）

```c++
setFrameShadow(...)
```

常见值：

```c++
QFrame::Plain    // 平面
QFrame::Raised   // 凸起
QFrame::Sunken   // 凹陷
```

一个完整例子

```c++
QFrame *frame = new QFrame(this);
frame->setFrameShape(QFrame::Box);
frame->setFrameShadow(QFrame::Raised);
```

## 4 按钮部件

QAbstractButton是按钮部件的抽象基类。

### 4.1 QPushButton

这是普通按钮。

例如：

确定
取消
发送
关闭

创建按钮

```c++
QPushButton *btn = new QPushButton("发送", this);
```

常用函数

```c++
void setText(const QString &text); // 设置按钮文本
void setIcon(const QIcon &icon);   // 设置按钮图标
void setEnabled(bool enabled);     // 设置是否可用
void click();                      // 以代码方式触发点击
bool isDown() const;               // 判断按钮是否处于按下状态
```

最核心信号

```c++
void clicked(bool checked = false);
void pressed();
void released();
```

### 4.2 QToolButton

这是工具按钮。

常用于：

工具栏
悬浮按钮
图标按钮

+ 特点:通常只有图标，没有大按钮边框

```c++
QToolButton *btn = new QToolButton(this);
btn->setIcon(QIcon(":/icons/settings.png"));
```

### 4.3 QRadioButton

这是单选按钮。

例如：

○ 男
○ 女

○ 浅色模式
○ 深色模式

+ 特点：同一父部件下的多个 `QRadioButton` 通常互斥，只能选一个；如果需要自定义分组，可使用 `QButtonGroup`。

```c++
QRadioButton *radio = new QRadioButton("深色模式", this);
```

常用函数

```c++
void setChecked(bool checked);
bool isChecked() const;
```

### 4.4 QCheckBox

这是复选按钮。
例如：

☑ 开机启动
☑ 启用动画
☑ 置顶显示

+ 特点：可以同时选多个

```c++
QCheckBox *check = new QCheckBox("开机启动", this);
```

常用函数

```c++
void setChecked(bool checked);
bool isChecked() const;
```

### 4.5 补充

QGroupBox 可以理解成：“带标题的控件分组框”,把一组相关控件包起来。

最基本用法

```c++
QGroupBox *group = new QGroupBox("系统设置", this);
```

最重要的作用是逻辑分组，通常会配合布局。
例如：

```c++
QVBoxLayout *layout = new QVBoxLayout;
layout->addWidget(new QCheckBox("开机启动"));
layout->addWidget(new QCheckBox("自动更新"));
group->setLayout(layout);
```

+ 一个很重要的功能
  可勾选 GroupBox

```c++
group->setCheckable(true);
```

```text
☑ 启用高级设置
```

取消勾选时，整个组里的控件会自动禁用。

常用函数:

```c++
// 设置分组框标题
void QGroupBox::setTitle(const QString &title);
// 获取分组框标题
QString QGroupBox::title() const;
// 设置是否可勾选
void QGroupBox::setCheckable(bool checkable);
// 设置是否已勾选
void QGroupBox::setChecked(bool checked);
// 判断是否已勾选
bool QGroupBox::isChecked() const;
```

## 5 QLineEdit

`QLineEdit` 是 Qt Widgets 中的单行文本输入控件。

### 5.1 创建

```c++
QLineEdit *edit = new QLineEdit(this);
```

带初始文本：

```c++
QLineEdit *edit = new QLineEdit("hello", this);
```

### 5.2 常用函数

#### 5.2.1 设置文本

```c++
void setText(const QString &text);
```

#### 5.2.2 获取文本

```c++
QString text() const;
```

#### 5.2.3 清空文本

```c++
void clear();
```

#### 5.2.4 占位文本

```c++
void setPlaceholderText(const QString &text);
```

例如：

```c++
edit->setPlaceholderText("请输入 API Key");
```

### 5.3 密码模式

```c++
void setEchoMode(EchoMode mode);
```

常用：

```c++
QLineEdit::Normal //正常显示
QLineEdit::Password //显示小黑点或星号等代替输入的字符
QLineEdit::NoEcho //不显示任何输入
```

例如：

```c++
edit->setEchoMode(QLineEdit::Password);
```

### 5.4 输入限制

#### 5.4.1 最大长度

```c++
void setMaxLength(int);
```

#### 5.4.2 只读

```c++
void setReadOnly(bool);
```

#### 5.4.3 输入验证

```c++
void setValidator(const QValidator *validator);
```

常用：

```c++
QIntValidator
QDoubleValidator
QRegularExpressionValidator
```

### 5.5 常用信号

#### 5.5.1 文本变化

```c++
void textChanged(const QString &text);
```

#### 5.5.2 编辑完成

```c++
void editingFinished();
```

#### 5.5.3 按下回车

```c++
void returnPressed();
```

## 6 QAbstractSpinBox

`QAbstractSpinBox` 是 Qt 中“微调输入框”的抽象基类。

```text
QAbstractSpinBox
 ├─ QSpinBox
 ├─ QDoubleSpinBox
 └─ QDateTimeEdit
```

它提供的是一类通用能力：文本输入框 + 上下调节按钮

### 6.1 QSpinBox

这是整数输入框。

```c++
QSpinBox *spin = new QSpinBox(this);
```

### 6.2 QDoubleSpinBox

这是浮点数输入框。

```c++
QDoubleSpinBox *spin = new QDoubleSpinBox(this);
```

### 6.3 QDateTimeEdit

这是日期时间输入框。

```c++
QDateTimeEdit *edit = new QDateTimeEdit(this);
```

### 6.4  QAbstractSpinBox 常用函数集合

#### 6.4.1 QAbstractSpinBox 本身常用函数

```c++
// 设置是否只读；只读后用户不能手动修改内容
void setReadOnly(bool r);
// 判断当前是否为只读状态
bool isReadOnly() const;
// 设置右侧按钮样式
void setButtonSymbols(QAbstractSpinBox::ButtonSymbols bs);
// 获取当前按钮样式
QAbstractSpinBox::ButtonSymbols buttonSymbols() const;
// 设置是否循环；例如最大值再增加会回到最小值
void setWrapping(bool w);
// 判断是否启用了循环
bool wrapping() const;
// 数值向上调整一步
void stepUp();
// 数值向下调整一步
void stepDown();
// 选中输入框中的全部文本
void selectAll();
// 清除编辑框当前显示文本，具体行为受子类和验证规则影响
void clear();
```

#### 6.4.2 按钮样式枚举

```c++
// 显示上下箭头按钮
QAbstractSpinBox::UpDownArrows;
// 显示加号 / 减号按钮
QAbstractSpinBox::PlusMinus;
// 不显示按钮，只保留输入框
QAbstractSpinBox::NoButtons;
```

#### 6.4.3 QSpinBox 常用函数

`QSpinBox` 用于整数输入。

```c++
// 设置整数范围
void setRange(int minimum, int maximum);
// 设置最小值
void setMinimum(int minimum);
// 设置最大值
void setMaximum(int maximum);
// 设置当前值
void setValue(int value);
// 获取当前值
int value() const;
// 设置每次点击按钮时增加或减少的步长
void setSingleStep(int val);
// 设置前缀，例如 "$100"
void setPrefix(const QString &prefix);
// 设置后缀，例如 "50%"
void setSuffix(const QString &suffix);
```

#### 6.4.4 QDoubleSpinBox 常用函数

`QDoubleSpinBox` 用于浮点数输入。

```c++
// 设置浮点数范围
void setRange(double minimum, double maximum);
// 设置最小值
void setMinimum(double minimum);
// 设置最大值
void setMaximum(double maximum);
// 设置当前值
void setValue(double value);
// 获取当前值
double value() const;
// 设置每次点击按钮时增加或减少的步长
void setSingleStep(double val);
// 设置小数位数
void setDecimals(int prec);
// 设置前缀，例如 "$12.5"
void setPrefix(const QString &prefix);
// 设置后缀，例如 "0.75x"
void setSuffix(const QString &suffix);
```

### 6.5 常用信号

```c++
// QSpinBox 数值变化时触发
void valueChanged(int i);
// QDoubleSpinBox 数值变化时触发
void valueChanged(double d);
// 显示文本变化时触发
void textChanged(const QString &text);
// 编辑完成时触发，通常是按下 Enter 或失去焦点
void editingFinished();
```

## 7 QAbstractSlider

`QAbstractSlider` 是 Qt 中“滑动调节类控件”的抽象基类。

```text
QAbstractSlider
 ├─ QSlider
 ├─ QScrollBar
 └─ QDial
```

### 7.1 QSlider

普通滑块控件。

```c++
QSlider *slider = new QSlider(Qt::Horizontal, this);
```

常见效果：

```text
0 ─────●──────── 100
```

### 7.2 QScrollBar

滚动条控件。

```c++
QScrollBar *bar = new QScrollBar(Qt::Vertical, this);
```

常见效果：

```text
▲
│
█
│
▼
```

### 7.3 QDial

旋钮控件。

```c++
QDial *dial = new QDial(this);
```

常见效果：

```text
  ◜●◝
```

类似旋钮，常用于音量、角度、仪表盘调节。

### 7.4 QAbstractSlider 常用函数

```c++
// 设置最小值
void setMinimum(int);
// 设置最大值
void setMaximum(int);
// 设置范围
void setRange(int min, int max);
// 设置当前值
void setValue(int);
// 获取当前值
int value() const;
// 设置单步步长，例如键盘方向键每次改变多少
void setSingleStep(int);
// 获取单步步长
int singleStep() const;
// 设置大步步长，例如 PageUp / PageDown 每次改变多少
void setPageStep(int);
// 获取大步步长
int pageStep() const;
// 设置方向：水平或垂直
void setOrientation(Qt::Orientation);
// 获取方向
Qt::Orientation orientation() const;
// 设置是否反向显示
void setInvertedAppearance(bool);
// 设置是否反向控制
void setInvertedControls(bool);
// 获取滑块当前位置
int sliderPosition() const;
// 设置滑块当前位置
void setSliderPosition(int);
// 设置拖动时是否实时更新 value
void setTracking(bool enable);
// 判断是否实时跟踪
bool hasTracking() const;
```

### 7.5 常用方向枚举

```c++
// 水平方向
Qt::Horizontal;
// 垂直方向
Qt::Vertical;
```

### 7.6 常用信号

```c++
// 当前值变化时触发
void valueChanged(int value);
// 用户按下滑块时触发
void sliderPressed();
// 用户释放滑块时触发
void sliderReleased();
// 滑块位置变化时触发
void sliderMoved(int position);
```

### 7.7 简单示例

```c++
QSlider *slider = new QSlider(Qt::Horizontal, this);
slider->setRange(0, 100);
slider->setValue(50);
slider->setSingleStep(1);
slider->setPageStep(10);
```

```text
范围：0 到 100
初始值：50
小步长：1
大步长：10
方向：水平
```

连接信号：

```c++
connect(slider, &QSlider::valueChanged, this, &MainWindow::onValueChanged);
```


