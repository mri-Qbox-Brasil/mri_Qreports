lib.callback.register('mri_Qreports:getConfig', function(source)
    return Config
end)

lib.callback.register('mri_Qreports:createTicket', function(source, data)
    local player = source
    local playerName = GetPlayerName(player)
    local playerId = player
    
    local ticket = {
        id = tostring(os.time()) .. player,
        playerId = playerId,
        playerName = playerName,
        title = data.title,
        description = data.description,
        status = 'ABERTO', -- TicketStatus.OPEN
        priority = data.priority,
        createdAt = os.time() * 1000, -- Convert to milliseconds for JS
        updatedAt = os.time() * 1000,
        messages = {
            {
                id = tostring(os.time()),
                senderId = playerId,
                senderName = playerName,
                content = data.description,
                timestamp = os.time() * 1000,
                isStaff = false
            }
        }
    }
    
    -- TODO: Save ticket to database
    
    TriggerEvent('mri_Qreports:notifyStaff', ticket)
    
    return ticket
end)

lib.addCommand('reportpainel', {
    help = 'Acesse o painel administrativo de reports',
    restricted = 'group.admin',
}, function(source, raw)
    -- local player = exports.qbx_core:GetPlayer(args.id)
    TriggerClientEvent('mri_Qreports:toggleUI', source)
end)


lib.addCommand('reportar', {
    help = 'Reporte um player'
}, function(source, raw)
    TriggerClientEvent('mri_Qreports:togglePlayerTicketUI', source)
end)

-- Handle updating the primary color
RegisterNetEvent('mri_Qreports:updatePrimaryColor', function(color)
    local source = source
    
    -- Check if player has permission (admin only)
    if IsPlayerAceAllowed(source, 'command.reportpainel') then
        -- Update the config
        Config.UI.PrimaryColor = color
        
        -- Broadcast the updated config to all clients
        TriggerClientEvent('mri_Qreports:configUpdated', -1, Config)
        
        -- TODO: Save to config file if needed
    end
end)

-- Event to notify staff about new tickets
RegisterNetEvent('mri_Qreports:notifyStaff', function(ticket)
    -- TODO: Implement notification system for staff
    print('New ticket created: ' .. ticket.title)
    
    -- Notify all staff members
    local players = GetPlayers()
    for _, playerId in ipairs(players) do
        if IsPlayerAceAllowed(playerId, 'command.reportpainel') then
            -- Send notification to staff
            TriggerClientEvent('mri_Qreports:ticketNotification', playerId, {
                title = 'Novo Ticket',
                message = 'Ticket criado por ' .. ticket.playerName .. ': ' .. ticket.title
            })
        end
    end
end)
