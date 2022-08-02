import { useEffect, useState } from "react";

const useCountdown = (target_date) => {
  const from_date = new Date(target_date).getTime();

  const [count_down, set_count_down] = useState(
    from_date - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      set_count_down(from_date - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [from_date]);

  return return_dates(count_down);
};

const return_dates = (count_down) => {
  // calculate time left
  const days = Math.floor(count_down / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (count_down % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((count_down % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((count_down % (1000 * 60)) / 1000);

  return [days, hours, minutes, seconds];
};

export { useCountdown, return_dates };
