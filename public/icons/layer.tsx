const LayerIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M8.67367 1.94663L12.607 3.6933C13.7403 4.1933 13.7403 5.01996 12.607 5.51996L8.67367 7.26663C8.22701 7.46663 7.49367 7.46663 7.04701 7.26663L3.11367 5.51996C1.98034 5.01996 1.98034 4.1933 3.11367 3.6933L7.04701 1.94663C7.49367 1.74663 8.22701 1.74663 8.67367 1.94663Z"
          stroke="#303030"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 7.33337C2 7.89337 2.42 8.54004 2.93333 8.76671L7.46 10.78C7.80667 10.9334 8.2 10.9334 8.54 10.78L13.0667 8.76671C13.58 8.54004 14 7.89337 14 7.33337"
          stroke="#303030"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 10.6666C2 11.2866 2.36667 11.8466 2.93333 12.1L7.46 14.1133C7.80667 14.2666 8.2 14.2666 8.54 14.1133L13.0667 12.1C13.6333 11.8466 14 11.2866 14 10.6666"
          stroke="#303030"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };
  
  export default LayerIcon;
  