local isVisible = false
local playerTicketVisible = false

-- Toggle admin UI visibility
RegisterNetEvent('mri_Qreports:toggleUI')
AddEventHandler('mri_Qreports:toggleUI', function()
    isVisible = not isVisible
    SendReactMessage('setVisible', isVisible)
    SetNuiFocus(isVisible, isVisible)
end)

-- Toggle player ticket UI visibility
RegisterNetEvent('mri_Qreports:togglePlayerTicketUI')
AddEventHandler('mri_Qreports:togglePlayerTicketUI', function()
    playerTicketVisible = not playerTicketVisible
    SendReactMessage('showPlayerTicketForm', playerTicketVisible)
    SetNuiFocus(playerTicketVisible, playerTicketVisible)
end)


RegisterNUICallback('hideFrame', function(_, cb)
    if isVisible then
        TriggerEvent('mri_Qreports:toggleUI')
        print('entrou no mapa fechando manu')
    end
    cb({})
end)

RegisterNUICallback('hideUI', function(_, cb)
    if isVisible then
        isVisible = false
        SetNuiFocus(false, false)
    end
    cb({})
end)


RegisterNUICallback('getConfig', function(_, cb)
    local config = lib.callback.await('mri_Qreports:getConfig')
    cb(config)
end)

RegisterNUICallback('updatePrimaryColor', function(data, cb)
    TriggerServerEvent('mri_Qreports:updatePrimaryColor', data.color)
    cb({})
end)

RegisterNUICallback('createTicket', function(data, cb)
    local response = lib.callback.await('mri_Qreports:createTicket', false, data)
    playerTicketVisible = false
    SetNuiFocus(false, false)
    cb(response)
end)

-- TODO callbacks, tickets etc..

-- RegisterNUICallback("get_tickets", function(data, cb)
-- 	local tickets = lib.callback.await("mri_Qreports:getTickets", false, data.ticketId, data.ticketOpener)
-- 	cb(tickets)
-- end)