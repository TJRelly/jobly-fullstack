/* eslint-disable react/prop-types */
/** Presentational component for showing bootstrap-style alerts.
 *
 * { LoginForm, SignupForm, ProfileForm } -> Alert
 **/
// import 'bootstrap/dist/css/bootstrap.css';

function Alert({ type = "danger", messages = [] }) {
  console.debug("Alert", "type=", type, "messages=", messages);
  if(type === "danger") {
    type = "p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
  }

  return (
      <div className={`${type}`} role="alert">
        {messages.map(error => (
            <p className="mb-0 small pb-2" key={error}>
              {error}
            </p>
        ))}
      </div>
  );
}

export default Alert;
