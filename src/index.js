import dva from 'dva';
import { notification } from 'antd';
import { createLogger } from 'redux-logger';
import './index.css';
// 1. Initialize
const app = dva({
  onError(e) {
    notification['error']({
      message: 'Error:',
      description: e.message,
    });
  },
  onAction: process.env.NODE_ENV === `development` ? createLogger() : [],
});

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
