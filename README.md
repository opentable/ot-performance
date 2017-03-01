# ot-performance

Project for collecting OpentTable's performance analyses.

## search-har

#### Start Chrome

In order to generate har files, one must first start chrome with the required flags.  First, quit any running instance of chrome.

The commands required for running chrome with flags are a function of one's operating system.

##### Mac

```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --enable-benchmarking --enable-net-benchmarking
```

##### Linux

```
google-chrome --remote-debugging-port=9222 --enable-benchmarking --enable-net-benchmarking
```

Now run the script.

```
npm run search-har
```
