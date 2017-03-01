# ot-performance

Project for collecting OpentTable's performance analyses.

## search-har

#### Start Chrome

In order to generate har files, one must first start chrome with the required flags.  First, quit any running instance of chrome.

The commands required for running chrome with flags are a function of one's operating system.

##### Mac

```
npm run remote-chrome-mac
```

##### Linux

```
npm run remote-chrome-linux
```

Now with the browser running in the foreground, run the script in another window.

```
npm run search-har
```
