all : style

style : style.css

style.css : style.styl
	stylus $<

