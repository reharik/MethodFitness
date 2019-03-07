#!/bin/bash
for x in `cat .envrc.qa`; do echo $x && export $x; done;
