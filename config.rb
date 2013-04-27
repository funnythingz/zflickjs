http_path = "./"
css_dir = (environment == :production) ? "css" : "css_debug"
sass_dir = "sass"
images_dir = "./images/"
javascripts_dir = "./"
line_comments = true
output_style = (environment == :production) ? :compressed : :expanded
