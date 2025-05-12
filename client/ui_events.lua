local isVisible = false

RegisterNetEvent('mri_Qreports:toggleUI')
AddEventHandler('mri_Qreports:toggleUI', function()
    isVisible = not isVisible
    SendReactMessage('setVisible', isVisible)
    SetNuiFocus(isVisible, isVisible)
end)


RegisterNUICallback('hideFrame', function(_, cb)
    if isVisible then
        TriggerEvent('mri_Qreports:toggleUI')
        print('entrou no mapa fechando manu')
    end
    cb({})
end)


-- TODO CALLBACKS TICKETS ETC..

-- RegisterNUICallback("get_tickets", function(data, cb)
-- 	local tickets = lib.callback.await("mri_Qreports:getTickets", false, data.ticketId, data.ticketOpener)
-- 	cb(tickets)
-- end)