defmodule Bulls.Setup do

  def new do
    %{
      users: [],
      players: [],
      readys: [],
      lastWinners: [],
    }

  def newUser(st, name) do
    %{ st |
      userName: name,
      users: st.users ++ [%{ name: name, wins: 0, losses: 0,}],
      player: false,
      ready: false,
    }
  end

  def player(st, playerBool) do
    %{st | player: playerBool, players: updatePlayers(st, playerBool)}
  end
  def updatePlayers(st, playerBool) do
    if playerBool do
      st.players ++ [st.userName]
    else
      List.delete(st.players, st.userName)
    end
  end

  def ready(st, readyBool) do
    %{st | ready: readyBool, readys: updateReadys(st, readyBool)}
  end
  def updateReadys(st, readyBool) do
    if readyBool do
      st.readys ++ [st.userName]
    else
      List.delete(st.readys, st.userName)
    end
  end

  def afterGame(st, winners) do
    %{
      userName: st.userName,
      users: updateScoreboard(st, winners),
      player: false,
      ready: false,
      players: [],
      readys: [],
      lastWinners: winners,
    }
  end
  def updateScoreboard(st, winners) do
    updateUser(st.users, st.players, winners, 0)
  end
  def updateUser(users, players, winners, i) do
    cond do
      i >= Enum.count(players) ->
        users
      Enum.member?(winners, Enum.at(players, i)) ->
        users
        |> addWinToUser(Enum.at(players, i))
        |> updateUser(players, winners, i + 1)
      true ->
        users
        |> addLossToUser(Enum.at(players, i))
        |> updateUser(players, winners, i + 1)
    end
  end
  def addWinToUser(users, name) do
    index = Enum.find_index(users, fn x -> Map.get(x, :name)===name end)
    user = Enum.find(users, fn x -> Map.get(x, :name)===name end)
    List.replace_at(users, index, %{ user | wins: user.wins + 1 })
  end
  def addLossToUser(users, name) do
    index = Enum.find_index(users, fn x -> Map.get(x, :name)===name end)
    user = Enum.find(users, fn x -> Map.get(x, :name)===name end)
    List.replace_at(users, index, %{ user | losses: user.losses + 1 })
  end

  def view(st) do
    if st.player do
      st
    else
      %{
        userName: st.userName,
        users: st.users,
        player: st.player,
        players: st.players,
        readys: st.readys,
      }
    end
  end
end
