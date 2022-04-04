finstall:
	$(MAKE) -C frontend install

fstart:
	$(MAKE) -C frontend start

fbuild:
	$(MAKE) -C frontend build

binstall:
	$(MAKE) -C blockchain install

bcompile:
	$(MAKE) -C blockchain compile

btest:
	$(MAKE) -C blockchain test