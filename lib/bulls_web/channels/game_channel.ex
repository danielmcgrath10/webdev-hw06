defmodule BullsWeb.GameChannel do
  use BullsWeb, :channel

  @impl true
  def join("game:"<> name, payload, socket) do
    if authorized?(payload) do
      game = Bulls.BackupAgent.get(name) || Bulls.Game.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      Bulls.BackupAgent.put(name, game)
      view = Bulls.Game.view(game)
      {:ok, view, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  def handle_in("guess", %{"guess" => ll}, socket) do
    name = socket.assigns[:name]
    game0 = socket.assigns[:game]
    game1 = Bulls.Game.guess(game0, ll)
    socket = assign(socket, :game, game1)
    Bulls.BackupAgent.put(name, game1)
    view = Bulls.Game.view(game1)
    {:reply, {:ok, view}, socket}
  end

  @impl true
  def handle_in("reset", _, socket) do
    name = socket.assigns[:name]
    game = Bulls.Game.new
    socket = assign(socket, :game, game)
    Bulls.BackupAgent.put(name, game)
    view = Bulls.Game.view(game)
    {:reply, {:ok, view}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
