//imports

function SetupPage() {

  const [state, setState] = useState({
    userName: "",
    users: [],
    player: false,
    ready: false,
    players: [],
    readys: [],
    lastWinners: [],
  });

  function playerClick(ev) {
    ch_push({playerBool: ev.checked});
  }

  function showReadyCheck() {
    if (state.player) {
      return <p>Ready? <input type="checkbox" id="readyCheck" onclick={readyClick}></p>;
    } else {
      return <p>Observing next game</p>;
    }
  }

  function readyClick(ev) {
    ch_push({readyBool: ev.checked});
  }

  let displayWinners = "Welcome to Bulls and Cows";

  if (state.lastWinners.length > 0) {
    displayWinners = "Won Last Game: " + state.lastWinners.toString();
  }

  return (
    <div className="Setup">
      <h2>Bulls and Cows Game</h2>
      <div className="row">
        <div className="column">
          <h3>{displayWinners}</h3>
        </div>
      </div>
      <div className="row">
        <div className="column">
          <p>User: {state.userName}</p>
        </div>
        <div className="column">
          <p>Playing Next Game? <input type="checkbox" id="playerCheck" onclick={playerClick}></p>
        </div>
        <div className="column">
          {showReadyCheck()}
        </div>
      </div>
      <div className="row">
        <div className="column">
          <div className="row">
            <div className="column">
              <h6>Players</h6>
            </div>
          </div>
          //TODO: list players and readiness
        </div>
        <div className="column">
          <div className="row">
            <div className="column">
              <h6>Scoreboard</h6>
            </div>
          </div>
          //TODO: display scoreboard
        </div>
      </div>
    </div>
  );
}

export default SetupPage;
