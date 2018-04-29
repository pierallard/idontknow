#!/bin/bash

python generate_human_variation_pink.py human1_green
python generate_human_variation_red.py human1_green
python generate_human_variation_pink.py human2_green
python generate_human_variation_red.py human2_green
python generate_human_variation_pink.py human3_green
python generate_human_variation_red.py human3_green

mv ../assets/human1_green_pink.png ../assets/human1_pink.png
mv ../assets/human1_green_red.png ../assets/human1_red.png
mv ../assets/human2_green_pink.png ../assets/human2_pink.png
mv ../assets/human2_green_red.png ../assets/human2_red.png
mv ../assets/human3_green_pink.png ../assets/human3_pink.png
mv ../assets/human3_green_red.png ../assets/human3_red.png

python generate_human_selected.py human1_green
python generate_human_selected.py human1_pink
python generate_human_selected.py human1_red
python generate_human_selected.py human2_green
python generate_human_selected.py human2_pink
python generate_human_selected.py human2_red
python generate_human_selected.py human3_green
python generate_human_selected.py human3_pink
python generate_human_selected.py human3_red
