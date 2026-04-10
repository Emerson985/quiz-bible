# Quiz Biblique

Application Electron de quiz biblique en français avec la Bible Louis Segond 1910 embarquée en local.

## Contenu

- 31 102 versets disponibles hors ligne
- filtres Ancien Testament, Nouveau Testament ou Bible complète
- questions générées à partir des versets
- mode multijoueur local jusqu'à 4 joueurs avec tours, classement et élimination
- création d'un installateur Windows pour partager l'application

## Lancer le projet

```bash
npm install
npm start
```

## Générer une version téléchargeable Windows

```bash
npm install
npm run dist
```

Le fichier d'installation sera créé dans le dossier `release/`.

Si Windows bloque la création des liens symboliques pendant `npm run dist`, utilisez la version portable :

```bash
npm run pack
npm run dist:zip
```

Dans ce cas, partagez le fichier `release/Quiz-Biblique-win.zip`.

## Version web (sans installation Electron)

Lancer en local dans un navigateur :

```bash
npm install
npm run start:web
```

Puis ouvrir `http://localhost:8080`.

Créer une archive web partageable :

```bash
npm run web:zip
```

Le fichier généré sera `release/Quiz-Biblique-web.zip`.

## Source biblique

Le fichier `data/segond_1910.json` utilise la version Louis Segond 1910 et indique explicitement : `This Bible is in the Public Domain.`