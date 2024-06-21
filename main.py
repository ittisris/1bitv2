def show4(num: number, line: number):
    global tmp
    tmp = num
    for x in range(4):
        if tmp % 2 == 1:
            led.plot(x, line)
        else:
            led.unplot(x, line)
        tmp = Math.floor(tmp / 2)
def showIO():
    x2 = 0
    while x2 <= len(input_port):
        if input_port[x2] == 1:
            led.plot(x2, 3)
        else:
            led.unplot(x2, 3)
        if output_port[x2] == 1:
            led.plot(x2, 4)
        else:
            led.unplot(x2, 4)
        x2 += 1

def on_button_pressed_a():
    reset()
input.on_button_pressed(Button.A, on_button_pressed_a)

def clkPosEdge():
    global pc
    if pins.digital_read_pin(DigitalPin.P2) == 1:
        writeIO()
    pins.digital_write_pin(DigitalPin.P1, 1)
    pc = pc + 1
    if pc == len(opcode):
        pc = 0
    basic.pause(500)
def clkNegEdge():
    sendInstruc()
    basic.pause(100)
    pins.digital_write_pin(DigitalPin.P1, 0)
    basic.pause(500)
def readIO():
    if pc == 0:
        input_port[pc] = pins.digital_read_pin(DigitalPin.P12)
        showIO()
    pins.digital_write_pin(DigitalPin.P0, input_port[ioaddress[pc]])
def writeIO():
    output_port[ioaddress[pc]] = pins.digital_read_pin(DigitalPin.P0)
    showIO()

def on_button_pressed_ab():
    global endless
    endless = True
    while endless:
        clkNegEdge()
        clkPosEdge()
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def on_button_pressed_b():
    clkNegEdge()
    clkPosEdge()
input.on_button_pressed(Button.B, on_button_pressed_b)

def sendInstruc():
    global instruc
    instruc = opcode[pc]
    show4(pc, 0)
    show4(instruc, 1)
    readIO()
    pins.digital_write_pin(DigitalPin.P13, instruc % 2)
    instruc = Math.floor(instruc / 2)
    pins.digital_write_pin(DigitalPin.P14, instruc % 2)
    instruc = Math.floor(instruc / 2)
    pins.digital_write_pin(DigitalPin.P15, instruc % 2)
    instruc = Math.floor(instruc / 2)
    pins.digital_write_pin(DigitalPin.P16, instruc % 2)
def reset():
    global endless, pc
    endless = False
    pins.digital_write_pin(DigitalPin.P8, 1)
    pins.digital_write_pin(DigitalPin.P1, 1)
    pc = 0
    basic.show_string("R")
    basic.pause(100)
    pins.digital_write_pin(DigitalPin.P8, 0)
    basic.clear_screen()
instruc = 0
endless = False
pc = 0
tmp = 0
output_port: List[number] = []
input_port: List[number] = []
ioaddress: List[number] = []
opcode: List[number] = []
led.set_brightness(50)
opcode = [0, 1, 2, 3, 4, 5, 6]
ioaddress = [0, 1, 0, 1, 0, 1, 0]
input_port = [0, 0, 0]
output_port = [0, 0, 0]
pins.set_pull(DigitalPin.P0, PinPullMode.PULL_UP)
pins.set_pull(DigitalPin.P1, PinPullMode.PULL_UP)
pins.set_pull(DigitalPin.P8, PinPullMode.PULL_DOWN)
tmp = pins.digital_read_pin(DigitalPin.P0)
reset()

def on_forever():
    basic.pause(100)
basic.forever(on_forever)
