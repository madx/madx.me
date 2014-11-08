RSYNC_FLAGS = --archive \
							--verbose \
							--compress \
							--delete \
							--chmod=ug=rwX,o=rX

serve:
	cd build; python3 -m http.server

deploy:
	rsync $(RSYNC_FLAGS) build/ $(shell cat .remote_location)
