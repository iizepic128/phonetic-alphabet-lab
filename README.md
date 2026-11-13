# The MAPO Phonetic Alphabet
Code to reproduce the results used in the video [Minmaxing the NATO alphabet](https://www.youtube.com/watch?v=By13Xxnaz-Q).

## Requirements
```bash
pip install -r requirements.txt
```

## Usage
First, generate audio files with
```bash
python tts.py
```
Then, featurize the audio files with
```bash
python features.py
```
Finally, train the model and classify the data with
```bash
python model.py
```
(each of the scripts have additional arguments for file paths, but they shouldn't be necessary for most use cases)


The results can then be analyzed to produce the final alphabets with `analysis.ipynb` (alphabets may not match video due to randomness during training).

## Web app

A lightweight browser interface is available in `web/`. It converts text into
NATO spelling words or either experimental MAPO alphabet saved in
`analysis.ipynb`. It includes live conversion, an A–Z reference, browser speech,
copying, and text downloads. Numbers, punctuation, and non-Latin characters are
preserved; spaces separate output word groups with `/`.

Run from the repository root (Python 3, no extra dependencies):

```bash
python -m http.server 8000 --bind 0.0.0.0 --directory web
```

Open http://localhost:8000. In GitHub Codespaces, forward port **8000** in the
Ports panel and open its browser URL. For static hosting, publish `web/` as the
site directory. No API keys, backend, or machine learning installation are
needed for this interface. Google Fonts is optional; system fonts provide a
fallback. Speech availability depends on the browser; clipboard access usually
requires HTTPS or localhost.

The web app uses saved experimental results, not live model inference. It does
not run the original audio generation or training pipeline; those scripts and
their usage above remain available unchanged.

### Credit

Original code, research, and MAPO alphabet results by **mapo (mapoware)**:
https://github.com/mapoware/mapo-alphabet. Copyright (c) 2026 mapo.
Original video: https://www.youtube.com/watch?v=By13Xxnaz-Q.
The web interface is an adaptation of this project. The original MIT license is
preserved in `LICENSE` and applies to this distribution.
