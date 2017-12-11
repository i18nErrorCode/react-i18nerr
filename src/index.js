import dva from 'dva';
import { notification } from 'antd';
import { createLogger } from 'redux-logger';
import createHistory from 'history/createBrowserHistory';
import './index.css';
// 1. Initialize
const app = dva({
  history: createHistory(),
  onError(e) {
    notification['error']({
      message: 'Error:',
      description: e.message,
    });
  },
  onAction: createLogger(),
});

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
